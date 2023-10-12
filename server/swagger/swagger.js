const swaggerUi = require("swagger-ui-express")
const swaggereJsdoc = require("swagger-jsdoc")
const {version} = require('../../package.json')
const {Express, Request, Response} = require('express')
const { appendFile } = require('fs')

const options = {
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "개발이 취미인 남자",
      description:
        "프로젝트 설명 Node.js Swaager swagger-jsdoc 방식 RestFul API 클라이언트 UI",
    },
    servers: [
      {
        url: "http://localhost:3000", // 요청 URL
      },
    ],
  },
  apis: ["./server/routes/*.js","./server/models/schemas/*.js"], //Swagger 파일 연동
}
const specs = swaggereJsdoc(options)

module.exports = { swaggerUi, specs }