declare module "*.css";

declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "@/lib/BlurGradientBg.module.js" {
  export class BlurGradientBg {
    constructor(options: { dom: HTMLElement; colors: string[]; loop: boolean });
    destroy(): void;
  }
}
