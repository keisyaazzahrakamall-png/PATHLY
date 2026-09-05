import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";

const projectRoot = path.resolve(import.meta.dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
}

function loadWindowScript(relativePath, window = {}) {
  vm.runInNewContext(read(relativePath), { window });
  return window;
}

test("setiap karier bawaan memakai bobot inti dan penting", () => {
  const window = loadWindowScript("js/requirements.js");
  const requirements = window.PATHLY_REQUIREMENTS;

  assert.equal(Object.keys(requirements).length, 5);

  for (const [careerId, skills] of Object.entries(requirements)) {
    assert.ok(skills.some((skill) => skill.weight === 3), `${careerId}: bobot Inti tidak ada`);
    assert.ok(skills.some((skill) => skill.weight === 2), `${careerId}: bobot Penting tidak ada`);
    assert.ok(
      skills.every((skill) =>
        (skill.weight === 3 && skill.targetLevel === 2) ||
        (skill.weight === 2 && skill.targetLevel === 1)
      ),
      `${careerId}: pasangan bobot dan target tidak konsisten`
    );
  }
});

test("provenance data menyebut sumber dan batasan bobot", () => {
  const window = loadWindowScript("js/careers.js");
  const provenance = window.PATHLY_DATA_PROVENANCE;

  assert.match(provenance.methodology, /O\*NET/);
  assert.match(provenance.methodology, /ESCO/);
  assert.match(provenance.methodology, /SKKNI/);
  assert.match(provenance.methodology, /bukan ambang rekrutmen/i);
  assert.equal(provenance.sourceDocument, "docs/DATA-SOURCES.md");
});

test("antarmuka membedakan referensi dari verifikasi dan scoring", () => {
  const publicCopy = [
    read("assessment.html"),
    read("results.html"),
    read("readiness.html"),
    read("roadmap.html"),
    read("js/readiness.js")
  ].join("\n");

  assert.doesNotMatch(publicCopy, /Kekuatan Bukti|Dasar bukti kuat/i);
  assert.match(publicCopy, /tidak memverifikasi referensi dan tidak memasukkannya ke skor/i);
  assert.match(read("assessment.html"), /Belum Ada Bukti/);
});

test("refleksi menjelaskan bahwa Pathly bukan CAAS tervalidasi", () => {
  const html = read("readiness.html");

  assert.match(html, /bukan instrumen CAAS 24 item/i);
  assert.match(html, /belum divalidasi secara psikometrik/i);
});

test("roadmap memiliki estimasi yang disesuaikan dan definisi selesai", () => {
  const source = read("js/roadmap.js");
  const html = read("roadmap.html");

  assert.match(source, /estimate:/);
  assert.match(source, /doneWhen:/);
  assert.match(source, /Selesai jika:/);
  assert.match(source, /Estimasi belajar awal:/);
  assert.match(source, /Waktu lebih panjang karena keahlian ini belum kamu kuasai/);
  assert.doesNotMatch(source, /Disesuaikan dari:/);
  assert.match(source, /Missing:[\s\S]*?Developing:[\s\S]*?Developed:/);
  assert.doesNotMatch(source, /resourceTitle|resourceUrl|roadmap-resource/);
  assert.match(html, /disesuaikan dengan status keahlian/i);
  assert.match(html, /Tempo keseluruhan roadmap menyesuaikan semestermu/i);
  assert.match(html, /bukan waktu untuk menguasai keseluruhan keahlian/i);
  assert.doesNotMatch(read("js/my-path.js"), /Dokumentasi pilihanmu|<strong>Sumber:<\/strong>/);
});

test("privasi terlihat sebelum daftar dan headers produksi tersedia", () => {
  const signup = read("signup.html");
  const privacy = read("privacy.html");
  const homepage = read("index.html");
  const profileMenu = read("js/auth/session-ui.js");
  const vercel = JSON.parse(read("vercel.json"));

  assert.match(signup, /href="privacy\.html"/);
  assert.doesNotMatch(homepage, /href="privacy\.html"/);
  assert.doesNotMatch(profileMenu, /["']privacy\.html["']/);
  assert.match(privacy, /Jangan unggah atau menuliskan data sensitif/i);
  assert.match(privacy, /Sistem tidak[\s\S]*?memvalidasi/i);
  assert.ok(
    vercel.headers[0].headers.some((header) => header.key === "Content-Security-Policy")
  );
});
