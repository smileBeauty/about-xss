const path = require("path");
const Koa = require("koa");
const KoaRouter = require("@koa/router");
const { bodyParser } = require("@koa/bodyparser");
const koaSession = require("koa-session");
const cors = require("@koa/cors");
const koaStatic = require("koa-static");
const packageObj = require("./package.json");

const app = new Koa();
const router = new KoaRouter();

router.get("/", (ctx) => {
  ctx.session.login = true;
  ctx.body = "hello world";
});

const xssRouter = new KoaRouter();
xssRouter.prefix("/xss");
// 反射型XSS
xssRouter.get("/reflectiveType", (ctx) => {
  const { value } = ctx.query;
  ctx.type = "html";
  ctx.body = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>反射型xss</title>
      </head>
      <body>
        <h1>欢迎${value}</h1>
      </body>
    </html>
  `;
});
xssRouter.get("/storageType", (ctx) => {
  const list = [
    { user: "user1", content: "非常棒！" },
    {
      user: "hacker",
      content: `<script>
        const imgDom = document.createElement("img");
        // imgDom.setAttribute("src", "http://localhost:8081/static/a.png");
        imgDom.src = "http://localhost:8081/static/a.png";
        const divDom = document.querySelector("div");
        divDom.append(imgDom);
        console.log(1111);
      </script>`,
    },
  ];
  function renderContent(_list) {
    const arr = _list.map(item => {
      return `
        <li>用户：${item.user}，内容：${item.content}</li>
      `;
    })
    return `<ul>${arr.join('')}</ul>`;
  }
  ctx.type = "html";
  ctx.body = `
    <!DOCTYPE html>
    <html lang="en">

    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>留言板 存储型xss</title>
    </head>

    <body>
      <div>留言板 存储型xss</div>
      <div id="content">${renderContent(list)}</div>
    </body>

    </html>
  `
});
router.use(xssRouter.routes());

app.keys = [packageObj.name];
app.use(
  koaSession(
    {
      key: "session",
      // sameSite: "strict",
    },
    app
  )
);
app.use(cors({ origin: "*", credentials: true }));
app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());
app.use(koaStatic(path.join(__dirname, "./static")));

app.listen(8080, () => {
  console.log(`serve on 8080`);
});
