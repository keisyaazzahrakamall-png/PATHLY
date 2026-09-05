function getErrorText(error) {
  return `${error?.code || ""} ${error?.message || ""}`.toLowerCase();
}

function isNetworkError(value) {
  return (
    value.includes("failed to fetch") ||
    value.includes("network") ||
    value.includes("load failed")
  );
}

export function getSignupErrorMessage(error) {
  const value = getErrorText(error);

  if (value.includes("already registered") || value.includes("already exists")) {
    return "Email tersebut sudah terdaftar. Silakan gunakan halaman login.";
  }

  if (value.includes("email address not authorized")) {
    return "Email tidak dapat menerima konfirmasi. Periksa kembali penulisannya atau gunakan email lain.";
  }

  if (value.includes("invalid email")) {
    return "Alamat email tidak valid. Periksa kembali penulisannya.";
  }

  if (value.includes("password")) {
    return "Password belum memenuhi persyaratan keamanan.";
  }

  if (value.includes("rate") || value.includes("too many")) {
    return "Terlalu banyak percobaan. Tunggu beberapa saat lalu coba kembali.";
  }

  if (value.includes("signup") && (value.includes("disabled") || value.includes("not allowed"))) {
    return "Pendaftaran akun sedang tidak tersedia. Hubungi pengelola Pathly.";
  }

  if (value.includes("database error") || value.includes("unexpected_failure")) {
    return "Akun belum dapat dibuat karena masalah sistem. Coba kembali atau hubungi pengelola Pathly.";
  }

  if (isNetworkError(value)) {
    return "Tidak dapat terhubung ke server. Periksa koneksi internet lalu coba kembali.";
  }

  return "Akun belum dapat dibuat. Periksa kembali data yang dimasukkan lalu coba lagi.";
}

export function getLoginErrorMessage(error) {
  const value = getErrorText(error);

  if (value.includes("email not confirmed")) {
    return "Email belum dikonfirmasi. Buka email konfirmasi dari Pathly terlebih dahulu.";
  }

  if (isNetworkError(value)) {
    return "Tidak dapat terhubung ke server. Periksa koneksi internet lalu coba kembali.";
  }

  return "Email atau password salah. Periksa kembali dan coba lagi.";
}

export function getPasswordResetErrorMessage(error) {
  const value = getErrorText(error);

  if (value.includes("rate") || value.includes("too many")) {
    return "Terlalu banyak permintaan. Tunggu beberapa saat lalu coba kembali.";
  }

  if (value.includes("email address not authorized")) {
    return "Email tidak dapat menerima tautan reset. Periksa kembali penulisannya atau gunakan email lain.";
  }

  if (isNetworkError(value)) {
    return "Tidak dapat terhubung ke server. Periksa koneksi internet lalu coba kembali.";
  }

  return "Tautan reset belum dapat dikirim. Periksa alamat email lalu coba kembali.";
}
