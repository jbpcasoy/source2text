const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Prompt the user to enter the directory path
rl.question("Enter the directory path: ", (directoryPath) => {
  rl.close();

  // Create a new text document
  const doc = [];
  let maxDepth = 0;
  const tableOfContents = [];

  // Function to traverse the directory structure
  function traverseDirectory(directoryPath, depth, callback) {
    const files = fs.readdirSync(directoryPath);

    if (depth > maxDepth) maxDepth = depth;

    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);
      const stat = fs.statSync(filePath);

      console.log(`Reading: ${filePath}...`);

      if (stat.isDirectory()) {
        const headingPrefix = "#".repeat(depth + 1); // Adjust the depth of the # indicators
        const folderHeading = `${headingPrefix} Folder: ${filePath}`;
        doc.push(folderHeading);
        tableOfContents.push(folderHeading);
        traverseDirectory(filePath, depth + 1, callback);
      } else {
        callback(filePath, depth);
      }
    });
  }

  // Traverse the code directory
  traverseDirectory(directoryPath, 0, (filePath, depth) => {
    // Read the content of each code file
    const fileContent = fs.readFileSync(filePath, "utf-8");

    // Add the content to the document array
    const headingPrefix = "#".repeat(depth + 1); // Adjust the depth of the # indicators
    const fileHeading = `${headingPrefix} File: ${filePath}`;
    doc.push(fileHeading);
    tableOfContents.push(fileHeading);
    doc.push(fileContent);
    doc.push("\n");
  });

  // Generate table of contents
  const tableOfContentsHeading = "# Table of Contents\n";
  const tableOfContentsContent = tableOfContents
    .map((heading) => `- ${heading}`)
    .join("\n");
  doc.unshift(tableOfContentsHeading, tableOfContentsContent, "\n");

  // Save the code document to a file
  const outputPath = "./output.txt";
  const textContent = doc.join("\n");

  fs.writeFileSync(outputPath, textContent, "utf-8");
  console.log(`Exported code to ${outputPath}`);
  console.log(`Max depth: ${maxDepth}`);
});
