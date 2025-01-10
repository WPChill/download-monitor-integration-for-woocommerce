const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

const pluginSlug = "download-monitor-integration-for-woocommerce";
const version = require("../package.json").version;

const output = fs.createWriteStream(
  path.join(__dirname, `../${pluginSlug}-${version}.zip`)
);
const archive = archiver("zip", {
  zlib: { level: 9 }
});

output.on("close", function () {
  console.log(archive.pointer() + " total bytes");
  console.log(
    "Archive has been finalized and the output file descriptor has closed."
  );
});
archive.on("error", function (err) {
  throw err;
});

archive.pipe(output);

archive.directory("build/classes/", `${pluginSlug}/classes`);
archive.directory("build/assets/", `${pluginSlug}/assets`);
archive.directory("build/languages/", `${pluginSlug}/languages`);
archive.directory("build/templates/", `${pluginSlug}/templates`);
archive.file("build/download-monitor-integration-for-woocommerce.php", { name: `${pluginSlug}/download-monitor-integration-for-woocommerce.php` });
archive.file("build/README.md", { name: `${pluginSlug}/README.md` });
archive.file("build/CHANGELOG.md", { name: `${pluginSlug}/CHANGELOG.md` });
archive.file("build/readme.txt", { name: `${pluginSlug}/readme.txt` });

archive.finalize();
