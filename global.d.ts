declare module '*.module.scss' {
	const styles: { [className: string]: string };
	export default styles;
}

declare module '*.scss' {
  const content: any;
  export default content;
}

declare module '*.svg' {
  import React = require('react');
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

declare module '*.svg?url' {
  const content: string;
  export default content;
}

declare module 'swiper/css';
declare module 'swiper/css/navigation';
declare module 'swiper/css/pagination';
