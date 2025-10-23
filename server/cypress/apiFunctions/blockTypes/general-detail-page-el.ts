import { validateSelectors, getVariableFromUrl } from "../functions";

export function generalDetailPageEl(url: string, content: any, i: number) {
  i += 1;
  cy.log("[GeneralDetailPageEl]()");
  const functionName = "generalDetailPageEl";

  cy.visit(url).then(() => {
    //^ Hero Content
    const main = {
      title: {
        selector: `div:nth-child(${i}) > section > div > div.order-5 > h1`,
        content: content.title,
      },
      summary: {
        selector: `div:nth-child(${i}) > section > div > div.order-5 > p`,
        content: content.summary,
      },
      imageUrl: {
        selector: `div:nth-child(${i}) > section > div > div.order-0 > div > picture > img`,
        content: content.heroImage?.url,
        attribute: "src",
        removeQueryString: true,
      },
    };
    validateSelectors(main, functionName);

    //^ Bible Snippets
    content.mainBodyMarkup && bibleSnippet(content, i);

    //^ Side Menu
    content.sideMenu.menuItems && sideMenu(content, i);
  });
}

function bibleSnippet(content: any, i: number) {
  const snippetSelector = {
    bibleSnippet: {
      selector: `div:nth-child(${i}) > div.container > div > main > section:nth-child(1) > div > section > div`,
      content: content.mainBodyMarkup,
    },
  };
  validateSelectors(snippetSelector, "Bible Snippet");
}

export function sideMenu(content: any, i: number) {
  const functionName = "sideMenu";
  getVariableFromUrl().then((env) => {
    content.sideMenu?.menuItems?.forEach((item: any, j: number) => {
      const extension = env === "MBI" ? `div:nth-child(${i}) >` : ``;
      //^ Items
      let selector = {
        itemTitle: {
          selector: item.isActive
            ? `${extension} div.container > div > aside > div > ul > li:nth-child(${j + 1}) > div`
            : `${extension} div.container > div > aside > div > ul > li:nth-child(${j + 1}) > a`,
          content: item.title,
        },
        ...(!item.isActive && {
          itemUrl: {
            selector: `${extension} div.container > div > aside > div > ul > li:nth-child(${j + 1}) > a`,
            content: item.href,
            removeQueryString: true,
          },
        }),
      };
      validateSelectors(selector, functionName);

      item?.menuItems?.forEach((subItem: any, k: number) => {
        //^ Sub-items
        let subSelector = {
          itemTitle: {
            selector: subItem.isActive
              ? `${extension} div.container > div > aside > div > ul > li:nth-child(${j + 1}) > ul > li:nth-child(${k + 1}) > div`
              : `${extension} div.container > div > aside > div > ul > li:nth-child(${j + 1}) > ul > li:nth-child(${k + 1}) > a`,
            content: subItem.title,
          },
          ...(!subItem.isActive && {
            itemUrl: {
              selector: `${extension} div.container > div > aside > div > ul > li:nth-child(${j + 1}) > ul > li:nth-child(${k + 1}) > a`,
              content: subItem.href,
              removeQueryString: true,
            },
          }),
        };

        // Verify sub-item selectors don't match parent item selectors
        if (subItem.title != content.title) {
          validateSelectors(subSelector, functionName);
        } else {
          cy.get(`${extension} div.container > div > aside > div > ul > li:nth-child(${j + 1}) > ul > li:nth-child(${k + 1}) > div`).should(
            "not.have.attr",
            "href"
          );
        }
      });
    });
  });
}
