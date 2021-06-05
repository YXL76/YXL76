// @ts-check

const { get } = require("https");
const { parseStringPromise } = require("xml2js");
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

new Promise((resolve, reject) => {
  let data = "";

  get(
    "https://www.douban.com/feed/people/151739065/interests",
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36",
      },
    },
    (res) =>
      res
        .on("data", (chunk) => (data += chunk))
        .once("end", () => resolve(data))
  ).once("error", reject);
})
  .then((data) => parseStringPromise(data))
  .then(
    ({
      rss: {
        channel: [{ item }],
      },
    }) => {
      const activities = item.map(
        ({ title: [title], link: [link], pubDate: [pubDate] }) => {
          const [d, m, y, c] = pubDate.split(" ").slice(1);
          if (title.slice(0, 2) === "最近") title = title.slice(2);
          const action = title.slice(0, 2);
          const name = title.slice(2);
          return `- ${action}[《${name}》](${link}) - \`${y}-${mouth[m]}-${d} ${c}\``;
        }
      );

      writeFileSync(
        "./README.md",
        `## Hi there 👋

<table>
<tr>
<td valign="top" width="54%">

### 🔭 Github stats

![YXL76's github stats](https://github-readme-stats.yxl76.vercel.app/api?username=YXL76&count_private=true&show_icons=true&include_all_commits=true&theme=prussian&line_height=28&disable_animations=true)

</td>

<td valign="top" width="46%">

### 🌱 Top languages

![Top Langs](https://github-readme-stats.yxl76.vercel.app/api/top-langs/?username=YXL76&layout=compact&theme=prussian&langs_count=8&hide=HTML,CSS,SCSS)

</td>
</tr>
<tr>
<td valign="top" width="54%">

### 📊 Weekly development breakdown

![Wakatime stats](https://github-readme-stats.yxl76.vercel.app/api/wakatime?username=YXL76&layout=compact&theme=prussian)


</td>
<td valign="top" width="46%">

### 📚 Douban activities

${activities.join("\n")}

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
    }
  );
