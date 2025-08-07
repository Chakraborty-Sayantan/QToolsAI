declare module "@/lib/BlurGradientBg.module.js" {
  export class BlurGradientBg {
    constructor(options: { dom: HTMLElement; colors: string[]; loop: boolean });
    destroy(): void;
  }
}
