const chai = require("chai");
const jsdom = require("jsdom");
const getPath = require("../getPath/getPath.js");
const fs = require("fs").promises;
const path = require("path");

const pathToTemplate = path.resolve(__dirname, "../getPath/index.html");
describe("getPath", function () {
    before(async function () {
        const template = await fs.readFile(pathToTemplate, {
            encoding: "utf-8",
        });
        const resourceLoader = new jsdom.ResourceLoader({
            userAgent:
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36",
        });
        global = new jsdom.JSDOM(template, {
            resource: resourceLoader,
            runScripts: "outside-only",
        }).window;
        Node = global.Node;
        document = global.document;
    });
    it("should return null if no valid argument = '' ", function () {
        chai.expect(getPath("")).to.eql(null);
    });

    it("should return null if no valid argument = {} ", function () {
        chai.expect(getPath({})).to.eql(null);
    });

    it("should return BODY if element is BODY element", function () {
        chai.expect(getPath(document.body)).to.be.string("BODY");
    });

    it("should return element's id if element has id", function () {
        const p = document.createElement("p");
        p.id = "my_p1";
        document.getElementById("menu").appendChild(p);

        chai.expect(getPath(p)).to.be.string("my_p1");
    });

    it("should return null if element not appended to body", function () {
        const p = document.createElement("p");

        chai.expect(getPath(p)).to.be.null;
    });

    it("should return html if received element is html", function () {
        chai.expect(getPath(document.documentElement)).to.be.string("HTML");
    });

    it("should not return element id if element's parent has other children with same id", function () {
        const el = document.getElementById("same_id2");
        chai.expect(getPath(el))
            .to.be.string("#wrap > DIV:nth-child(3) > DIV:nth-child(4)")
            .not.has.string("same_id2");
    });

    it("should find greater parent if parent's id is not unique", function () {
        const el = document.querySelector(".unique_class");

        chai.expect(getPath(el))
            .to.match(/^\#wrap/)
            .be.string("#wrap > DIV:nth-child(2) > DIV:nth-child(4)")
            .not.match(/same_id1/);
    });
});
