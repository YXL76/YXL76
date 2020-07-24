const https = require("https");
const { writeFileSync } = require("fs");

let body = "";

https.get(
  "https://gist.githubusercontent.com/YXL76/fa9ef0deb6800d867c1598195d51bc22/raw/1d111221bba7161d2c1ed7d93bf6ecd372609932/%25F0%259F%2593%258A%2520Weekly%2520development%2520breakdown",
  (res) => {
    res.on("data", (chunk) => {
      body += chunk;
    });
    res.on("end", () => {
      writeFileSync(
        "./README.md",
        `### Hi there 👋

### 📊 Weekly development breakdown

\`\`\`text
${body}
\`\`\`

<!--
**YXL76/YXL76** is a ✨ _special_ ✨ repository because its \`README.md\` (this file) appears on your GitHub profile.

Here are some ideas to get you started:

- 🔭 I’m currently working on ...
- 🌱 I’m currently learning ...
- 👯 I’m looking to collaborate on ...
- 🤔 I’m looking for help with ...
- 💬 Ask me about ...
- 📫 How to reach me: ...
- 😄 Pronouns: ...
- ⚡ Fun fact: ...
-->
`
      );
    });
  }
);
