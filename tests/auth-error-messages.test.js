import assert from "node:assert/strict";
import test from "node:test";
import {
  getLoginErrorMessage,
  getPasswordResetErrorMessage,
  getSignupErrorMessage
} from "../js/lib/auth-error-messages.js";

test("error email tidak diizinkan tidak disebut sebagai gangguan koneksi", () => {
  assert.match(
    getSignupErrorMessage({ message: "Email address not authorized" }),
    /Periksa kembali penulisannya/
  );
});

test("hanya error jaringan yang menampilkan pesan koneksi", () => {
  assert.match(
    getSignupErrorMessage({ message: "Failed to fetch" }),
    /koneksi internet/
  );
  assert.doesNotMatch(
    getSignupErrorMessage({ message: "Database error saving new user" }),
    /koneksi internet/
  );
});

test("login membedakan email belum dikonfirmasi dan gangguan jaringan", () => {
  assert.match(
    getLoginErrorMessage({ message: "Email not confirmed" }),
    /belum dikonfirmasi/
  );
  assert.match(
    getLoginErrorMessage({ message: "Network request failed" }),
    /koneksi internet/
  );
});

test("reset password membedakan rate limit dan kesalahan email", () => {
  assert.match(
    getPasswordResetErrorMessage({ message: "Email rate limit exceeded" }),
    /Terlalu banyak permintaan/
  );
  assert.match(
    getPasswordResetErrorMessage({ message: "Email address not authorized" }),
    /Periksa kembali penulisannya/
  );
});
