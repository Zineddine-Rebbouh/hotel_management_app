import { test, expect } from '@playwright/test';

const UI_URL = "http://localhost:5173/"
test('should allow the user to sign in ', async ({ page }) => {

  // visit website first
  await page.goto(UI_URL);

  // click on login buttom
  await page.getByRole("link", { name: "Sign In" }).click()

  // faced the heading of the page
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible()

  // insert  email and password
  await page.locator("[name=email]").fill("1@1.com")
  await page.locator("[name=password]").fill("password123")

  await page.getByRole("button", { name: "Sign In" }).click()

  // check if login succes
  // check if the toast succes is shown
  await expect(page.getByText("SignIn Success !")).toBeVisible()

  // check the heading links if they appear
  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible()
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible()
  await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible()
});


test("should allow user to register", async ({ page }) => {
  // const testEmail = `test_register_${Math.floor(Math.random() * 90000) + 10000}@test.com`;
  await page.goto(UI_URL);

  await page.getByRole("link", { name: "Sign Up" }).click();
  await expect(
    page.getByRole("heading", { name: "Create an Account" })
  ).toBeVisible();

  await page.locator("[name=firstname]").fill("test222_firstName");
  await page.locator("[name=lastname]").fill("test1111_lastName");
  await page.locator("[name=email]").fill("1@1122121.com");
  await page.locator("[name=password]").fill("password123");
  await page.locator("[name=confirmPassword]").fill("password123");

  await page.getByRole("button", { name: "Create Account" }).click();

  await expect(page.getByText("Registration Success")).toBeVisible();
  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible();
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();
});