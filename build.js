const https = require("https");
const xml2js = require("xml2js");
const { readFileSync, writeFileSync } = require("fs");

const mouth = {
  Jan: 1,
  Feb: 2,
  Mar: 3,
  Apr: 4,
  May: 5,
  Jun: 6,
  Jul: 7,
  Aug: 8,
  Sept: 9,
  Oct: 10,
  Nov: 11,
  Dec: 12,
};

let weekly = readFileSync(
  "./fa9ef0deb6800d867c1598195d51bc22/📊 Weekly development breakdown",
  "utf-8"
);

weekly = weekly.split("\n");

let index = 0;
while (weekly[0][index] !== " ") {
  ++index;
}
while (weekly[0][index] === " ") {
  ++index;
}

weekly = weekly.map((item) => {
  const l = item.slice(0, index);
  const r = item.slice(index);
  return `${l.trim()}
 └─────  ${r}`;
});

let douban = "";

https.get(
  "https://www.douban.com/feed/people/151739065/interests",
  {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36",
    },
  },
  (res) => {
    res.on("data", (chunk) => {
      douban += chunk;
    });
    res.on("end", () => {
      xml2js.parseStringPromise(douban).then((result) => {
        douban = result.rss.channel[0].item.map(({ title, link, pubDate }) => {
          date = pubDate[0].split(" ");
          if (title[0].slice(0, 2) === "最近") {
            title[0] = title[0].slice(2);
          }
          return `- ${title[0].slice(0, 2)}[《${title[0].slice(2)}》](${
            link[0]
          }) - \`${date[3]}-${mouth[date[2]]}-${date[1]} ${date[4]}\``;
        });

        writeFileSync(
          "./README.md",
          `## Hi there 👋

[![GitHub followers](https://img.shields.io/github/followers/YXL76?style=for-the-badge&color=blue)](https://github.com/YXL76?tab=followers)
[![Website](https://img.shields.io/website?style=for-the-badge&up_message=Blog&url=https%3A%2F%2Fyxl76.net%2F&color=brightgreen)](https://yxl76.net)
[![GitHub last commit](https://img.shields.io/github/last-commit/YXL76/YXL76?label=update&style=for-the-badge&color=orange)](https://github.com/YXL76/YXL76)

<table>
<tr>
<td valign="top" width="54%">

### 🔭 Github stats

![YXL76's github stats](https://github-readme-stats.yxl76.vercel.app/api?username=YXL76&count_private=true&show_icons=true&theme=tokyonight)

</td>

<td valign="top" width="46%">

### 🌱 Top languages

![Top Langs](https://github-readme-stats.yxl76.vercel.app/api/top-langs/?username=YXL76&layout=compact&theme=tokyonight)

</td>
</tr>
<tr>
<td valign="top" width="54%" style="font-size: 16px;">

### 📊 Weekly development breakdown

\`\`\`text
${weekly.join("\n")}
Other ...
\`\`\`

</td>
<td valign="top" width="46%">

### 📚 Douban activities

${douban.join("\n")}

</td>
</tr>
</table>

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
    });
  }
);
