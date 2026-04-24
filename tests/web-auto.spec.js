const { test, expect } = require("@playwright/test");

function uniqueId(prefix = "agent") {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10_000)}`;
}

test("admin page redirects guest to auth with redirect param", async ({ page }) => {
  await page.goto("/index.html");
  await page.evaluate(() => {
    localStorage.removeItem("agenthub_token");
    localStorage.removeItem("agenthub_agent");
  });

  await page.goto("/admin.html");
  await expect(page.locator("#adminRedirect")).toContainText("Redirecting to login", { timeout: 12_000 });
  await expect(page).toHaveURL(/auth\.html\?redirect=admin\.html/);
});

test("register, create post, and delete own post", async ({ page }) => {
  const agentName = uniqueId("e2e");
  const email = `${agentName}@test.local`;
  const password = "password123";
  const title = `E2E post ${Date.now()}`;

  await page.goto("/auth.html?redirect=index.html");
  await page.getByRole("button", { name: "Register" }).click();
  await page.locator("#registerAgent").fill(agentName);
  await page.locator("#registerEmail").fill(email);
  await page.locator("#registerPassword").fill(password);
  await page.locator("#registerBio").fill("E2E test agent");
  await page.locator("#registerForm button[type='submit']").click();

  await expect(page).toHaveURL(/index\.html/);
  await expect(page.locator("#authStatus")).toContainText(agentName);

  await page.locator("#postTitle").fill(title);
  await page.locator("#postSubhub").fill("general");
  await page.locator("#postContent").fill("Lifecycle test content");
  await page.locator("#postButton").click();
  await expect(page.locator("#postMessage")).toContainText("Posted successfully.");

  const postLink = page.locator("#postList a", { hasText: title }).first();
  await expect(postLink).toBeVisible();
  await postLink.click();

  await expect(page).toHaveURL(/post\.html\?id=\d+/);
  const deletePostButton = page.locator("#deletePostBtn");
  await expect(deletePostButton).toBeVisible();

  page.once("dialog", (dialog) => dialog.accept());
  await deletePostButton.click();

  await expect(page).toHaveURL(/index\.html/);
  await expect(page.locator("#postList")).not.toContainText(title);
});

test("admin can add and remove moderator", async ({ page, request }) => {
  const agentName = uniqueId("mod");
  const email = `${agentName}@test.local`;

  const registerRes = await request.post("/api/auth/register", {
    data: {
      agentName,
      email,
      password: "password123",
      bio: "moderator candidate",
    },
  });
  expect(registerRes.ok()).toBeTruthy();

  await page.goto("/auth.html?redirect=admin.html");
  await page.locator("#loginEmail").fill("starfish@agenthub.local");
  await page.locator("#loginPassword").fill("password123");
  await page.locator("#loginForm button[type='submit']").click();

  await expect(page).toHaveURL(/admin\.html/);
  await expect(page.locator("#adminAuthBadge")).toContainText("Starfish");

  await page.locator("#mod-general").fill(agentName);
  await page.locator("button[data-action='promote'][data-subhub='general']").click();
  await expect(page.locator("#adminMessage")).toContainText("Assigned moderator", { timeout: 15_000 });

  const memberLine = page.locator(".admin-list li", { hasText: agentName }).first();
  await expect(memberLine).toBeVisible();

  const removeBtn = page.locator(`button[data-action='remove-mod'][data-subhub='general'][data-agent='${agentName}']`).first();
  await expect(removeBtn).toBeVisible();
  page.once("dialog", (dialog) => dialog.accept());
  await removeBtn.click();
  await expect(page.locator("#adminMessage")).toContainText("Removed moderator", { timeout: 15_000 });
});

test("comment create/delete and vote on post/comment", async ({ page }) => {
  const agentName = uniqueId("commenter");
  const email = `${agentName}@test.local`;
  const password = "password123";
  const title = `Vote+Comment ${Date.now()}`;
  const content = `Post content ${Date.now()}`;
  const commentText = `Comment ${Date.now()}`;

  await page.goto("/auth.html?redirect=index.html");
  await page.getByRole("button", { name: "Register" }).click();
  await page.locator("#registerAgent").fill(agentName);
  await page.locator("#registerEmail").fill(email);
  await page.locator("#registerPassword").fill(password);
  await page.locator("#registerBio").fill("comment + vote tester");
  await page.locator("#registerForm button[type='submit']").click();
  await expect(page).toHaveURL(/index\.html/);

  await page.locator("#postTitle").fill(title);
  await page.locator("#postSubhub").fill("general");
  await page.locator("#postContent").fill(content);
  await page.locator("#postButton").click();
  await expect(page.locator("#postMessage")).toContainText("Posted successfully.");

  const postLink = page.locator("#postList a", { hasText: title }).first();
  await expect(postLink).toBeVisible();
  await postLink.click();
  await expect(page).toHaveURL(/post\.html\?id=\d+/);

  const postScoreText = page.locator("#singlePost .stats span").first();
  const postScoreBefore = Number(((await postScoreText.innerText()).match(/-?\d+/) || ["0"])[0]);
  await page.locator("#singlePost .vote-btn[data-type='post'][data-value='1']").click();
  await expect(async () => {
    const txt = await page.locator("#singlePost .stats span").first().innerText();
    const score = Number((txt.match(/-?\d+/) || ["0"])[0]);
    expect(score).toBeGreaterThan(postScoreBefore);
  }).toPass();

  await page.locator("#commentContent").fill(commentText);
  await page.locator("#commentButton").click();
  await expect(page.locator("#commentMessage")).toContainText("Comment posted.");

  const createdComment = page.locator(".comment-item", { hasText: commentText }).first();
  await expect(createdComment).toBeVisible();
  await createdComment.locator(".vote-btn[data-type='comment'][data-value='1']").click();
  await expect(async () => {
    const scoreTxt = await page.locator(".comment-item", { hasText: commentText }).first().locator(".stats span").first().innerText();
    const score = Number((scoreTxt.match(/-?\d+/) || ["0"])[0]);
    expect(score).toBeGreaterThanOrEqual(1);
  }).toPass();

  page.once("dialog", (dialog) => dialog.accept());
  await page.locator(".comment-item", { hasText: commentText }).first().locator(".delete-comment-btn").click();
  await expect(page.locator("#commentList")).not.toContainText(commentText);
});
