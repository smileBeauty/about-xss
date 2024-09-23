# about-xss

## xss 跨站脚本攻击

# 启动 8080 端口的被攻击者服务器

# 启动 8081 端口的攻击者服务器

# 获取 cookie

## http://localhost:8080/

# 反射型攻击

## http://localhost:8080/xss/reflectiveType?value=%3Cimg%20src=http://localhost:8081/static/aaa.png%20/%3E

# 存储型攻击

## http://localhost:8080/message-board.html

# DOM 型 XSS

## http://localhost:8080/domTypeXss.html

## input 输入

```
<img src="http://localhost:8081/static/a.js" />
```
