import { validateSelectors } from "../functions";

export function titwPromoBannerBlock(url: string, content: any, i: number) {
  cy.log("[TitwPromoBannerBlock]()");
  const functionName = "titwPromoBannerBlock";

  cy.visit(url).then(() => {
    const main = {
      heading: {
        selector: `section:nth-child(${i}) > div > div.flex > div.space-y-1 > p.text-base`,
        content: content.heading,
      },
      subheading: {
        selector: `section:nth-child(${i}) > div > div.flex > div.space-y-1 > p.text-sm`,
        content: content.subHeading,
      },
      imageUrl: {
        selector: `section:nth-child(${i}) > div > div.flex > div.aspect-square > img`,
        content: content.image.url,
        attribute: "src",
      },
    };
    validateSelectors(main, functionName);

    //^ Buttons
    const buttonsApi = [content.buttonLink1, content.buttonLink2];

    buttonsApi.forEach((content: any) => {
      const buttonStyleMap = {
        primary: "border-light-blue-900",
        secondary: "border-cyan-600",
        neutral: "border-grey-800",
      };
      const buttonStyle = buttonStyleMap[content.buttonStyle as keyof typeof buttonStyleMap];
      if (!buttonStyle) throw new Error("Invalid button style | promoBannerTitw");

      const button = {
        btn: {
          selector: `section:nth-child(${i}) > div > div:nth-child(2) > a.${buttonStyle}`,
          content: content.text,
        },
        btnUrl: {
          selector: `section:nth-child(${i}) > div > div:nth-child(2) > a.${buttonStyle}`,
          content: content.href,
        },
        buttonSize: {
          selector: `section:nth-child(${i}) > div > div:nth-child(2) > a.${buttonStyle}`,
          content: content.buttonSize,
          attribute: "size:",
        },
      };
      validateSelectors(button, functionName);
    });
  });
}
