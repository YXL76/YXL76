const https = require("https");
const xml2js = require("xml2js");
const { writeFileSync } = require("fs");

const mouth = {
  Jan: 1,
  Feb: 2,
  Mar: 3,
  Apr: 4,
  May: 5,
  Jun: 6,
  Jul: 7,
  Aug: 8,
  Sep: 9,
  Oct: 10,
  Nov: 11,
  Dec: 12,
};

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

<table>
<tr>
<td valign="top" width="54%">

### 🔭 Github stats

![YXL76's github stats](https://github-readme-stats.yxl76.vercel.app/api?username=YXL76&count_private=true&show_icons=true&theme=tokyonight&line_height=28)

</td>

<td valign="top" width="46%">

### 🌱 Top languages

![Top Langs](https://github-readme-stats.yxl76.vercel.app/api/top-langs/?username=YXL76&layout=compact&theme=tokyonight&langs_count=10&hide=HTML,CSS,SCSS)

</td>
</tr>
<tr>
<td valign="top" width="54%">

### 📊 Weekly development breakdown

![Wakatime stats](https://github-readme-stats.yxl76.vercel.app/api/wakatime?username=YXL76&layout=compact&theme=tokyonight)


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
