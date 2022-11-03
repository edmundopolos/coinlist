describe("Welcome", () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('"Sign In" button should be visible', async () => {
    await expect(element(by.id("sign-button"))).toBeVisible();
    await element(by.id("sign-button")).tap();
    await expect(element(by.id("proceed-button"))).toBeVisible();
  });

  it('shows "Proceed to login"', async () => {
    await element(by.id("proceed-button")).tap();
  });

  it('shows "Login Page"', async () => {
    await expect(element(by.id("login-page"))).toBeVisible();
    await element(by.id("emailField")).typeText("Test@test.com");
    await element(by.id("passwordField")).typeText("Test@123");
    await element(by.id("login-button")).tap();
  });
  it('shows "Login Page"', async () => {
    await expect(element(by.id("homepage"))).toBeVisible();
    await element(by.id("searchField")).typeText("bnb");

    await element(by.id("menu")).tap();
  });
});
