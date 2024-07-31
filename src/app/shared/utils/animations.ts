import { animate, keyframes, style, transition, trigger } from '@angular/animations';

const slides = [
  trigger('slideFromLeft', [
    transition(':enter', [
      style({ transform: 'translateX(-100%)', opacity: 0 }),
      animate('300ms ease', style({ transform: 'translateX(0%)', opacity: 1 })),
    ]),
    transition(':leave', [animate('300ms ease', style({ transform: 'translateX(-100%)', opacity: 0 }))]),
  ]),
  trigger('slideFromRight', [
    transition(':enter', [
      style({ transform: 'translateX(100%)', opacity: 0 }),
      animate('300ms ease', style({ transform: 'translateX(0%)', opacity: 1 })),
    ]),
    transition(':leave', [animate('300ms ease', style({ transform: 'translateX(100%)', opacity: 0 }))]),
  ]),
  trigger('slideFromTop', [
    transition(':enter', [
      style({ transform: 'translateY(-100%)' }),
      animate('200ms ease', style({ transform: 'translateY(0%)' })),
    ]),
    transition(':leave', [animate('200ms ease', style({ transform: 'translateY(-100%)' }))]),
  ]),
  trigger('slideFromBottom', [
    transition(':enter', [
      style({ transform: 'translateY(100%)', opacity: 0, position: 'absolute' }),
      animate('300ms ease', style({ transform: 'translateY(0%)', opacity: 1 })),
    ]),
    transition(':leave', [animate('300ms ease', style({ transform: 'translateY(100%)', opacity: 0 }))]),
  ]),
];

const fade = [
  trigger('fade', [
    transition(':enter', [style({ opacity: 0 }), animate('300ms ease', style({ opacity: 1 }))]),
    transition(':leave', [animate('300ms ease', style({ opacity: 0 }))]),
  ]),
];

const scales = [
  trigger('scaleIn', [
    transition(':enter', [
      style({ transform: 'scale(0)', opacity: 0 }),
      animate('300ms ease', style({ transform: 'scale(1)', opacity: 1 })),
    ]),
    transition(':leave', [animate('300ms ease', style({ transform: 'scale(0)', opacity: 0 }))]),
  ]),
  trigger('scaleOut', [
    transition(':enter', [
      style({ transform: 'scale(2)', opacity: 0 }),
      animate('300ms ease', style({ transform: 'scale(1)', opacity: 1 })),
    ]),
    transition(':leave', [animate('300ms ease', style({ transform: 'scale(2)', opacity: 0 }))]),
  ]),
];

const zooms = [
  trigger('zoomOut', [
    transition(':enter', [
      style({ transform: 'scale(0)', opacity: 0 }),
      animate('300ms ease', style({ transform: 'scale(1)', opacity: 1 })),
    ]),
    transition(':leave', [animate('300ms ease', style({ transform: 'scale(2)', opacity: 0 }))]),
  ]),
  trigger('zoomIn', [
    transition(':enter', [
      style({ transform: 'scale(2)', opacity: 0 }),
      animate('300ms ease', style({ transform: 'scale(1)', opacity: 1 })),
    ]),
    transition(':leave', [animate('300ms ease', style({ transform: 'scale(0)', opacity: 0 }))]),
  ]),
];

const slips = [
  trigger('slipFromRight', [
    transition(':enter', [
      style({ transform: 'translateX(-100%)', opacity: 0 }),
      animate('300ms ease', style({ transform: 'translateX(0%)', opacity: 1 })),
    ]),
    transition(':leave', [animate('300ms ease', style({ transform: 'translateX(100%)', opacity: 0 }))]),
  ]),
  trigger('slipFromLeft', [
    transition(':enter', [
      style({ transform: 'translateX(100%)', opacity: 0 }),
      animate('300ms ease', style({ transform: 'translateX(0%)', opacity: 1 })),
    ]),
    transition(':leave', [animate('300ms ease', style({ transform: 'translateX(-100%)', opacity: 0 }))]),
  ]),
  trigger('slipFromTop', [
    transition(':enter', [
      style({ transform: 'translateY(-100%)', opacity: 0 }),
      animate('200ms ease', style({ transform: 'translateY(0%)', opacity: 1 })),
    ]),
    transition(':leave', [animate('200ms ease', style({ transform: 'translateY(100%)', opacity: 0 }))]),
  ]),
  trigger('slipFromBottom', [
    transition(':enter', [
      style({ transform: 'translateY(100%)', opacity: 0, position: 'absolute' }),
      animate('300ms ease', style({ transform: 'translateY(0%)', opacity: 1 })),
    ]),
    transition(':leave', [animate('300ms ease', style({ transform: 'translateY(-100%)', opacity: 0 }))]),
  ]),
];

const flips = [
  trigger('flipHorizontally', [
    transition(':enter', [
      style({ transform: 'perspective(400px) rotateX(90deg)', opacity: 0 }),
      animate('300ms ease', style({ transform: 'perspective(400px) rotateX(0deg)', opacity: 1 })),
    ]),
    transition(':leave', [
      animate('300ms ease', style({ transform: 'perspective(400px) rotateX(-90deg)', opacity: 0 })),
    ]),
  ]),
  trigger('flipVertically', [
    transition(':enter', [
      style({ transform: 'perspective(400px) rotateY(90deg)', opacity: 0 }),
      animate('300ms ease', style({ transform: 'perspective(400px) rotateY(0deg)', opacity: 1 })),
    ]),
    transition(':leave', [
      animate('300ms ease', style({ transform: 'perspective(400px) rotateY(-90deg)', opacity: 0 })),
    ]),
  ]),
];

const rotates = [
  trigger('rotateFromLeft', [
    transition(':enter', [
      style({ transform: 'rotate(0deg)', opacity: 0 }),
      animate('300ms ease', style({ transform: 'rotate(360deg)', opacity: 1 })),
    ]),
    transition(':leave', [animate('300ms ease', style({ transform: 'rotate(720deg)', opacity: 0 }))]),
  ]),
  trigger('rotateFromRight', [
    transition(':enter', [
      style({ transform: 'rotate(0deg)', opacity: 0 }),
      animate('300ms ease', style({ transform: 'rotate(-360deg)', opacity: 1 })),
    ]),
    transition(':leave', [animate('300ms ease', style({ transform: 'rotate(-720deg)', opacity: 0 }))]),
  ]),
];

const shakes = [
  trigger('shakeHorizontally', [
    transition(':enter', [
      style({ transform: 'translateX(0%)' }),
      animate(
        '500ms ease-in-out',
        keyframes([
          style({ transform: 'translateX(-5%)', offset: 0.1 }),
          style({ transform: 'translateX(5%)', offset: 0.2 }),
          style({ transform: 'translateX(-5%)', offset: 0.3 }),
          style({ transform: 'translateX(5%)', offset: 0.4 }),
          style({ transform: 'translateX(-5%)', offset: 0.5 }),
          style({ transform: 'translateX(5%)', offset: 0.6 }),
          style({ transform: 'translateX(-5%)', offset: 0.7 }),
          style({ transform: 'translateX(5%)', offset: 0.8 }),
          style({ transform: 'translateX(-5%)', offset: 0.9 }),
          style({ transform: 'translateX(0%)', offset: 1 }),
        ])
      ),
    ]),
  ]),
  trigger('shakeVertically', [
    transition(':enter', [
      style({ transform: 'translateY(0%)' }),
      animate(
        '500ms ease-in-out',
        keyframes([
          style({ transform: 'translateY(-5%)', offset: 0.1 }),
          style({ transform: 'translateY(5%)', offset: 0.2 }),
          style({ transform: 'translateY(-5%)', offset: 0.3 }),
          style({ transform: 'translateY(5%)', offset: 0.4 }),
          style({ transform: 'translateY(-5%)', offset: 0.5 }),
          style({ transform: 'translateY(5%)', offset: 0.6 }),
          style({ transform: 'translateY(-5%)', offset: 0.7 }),
          style({ transform: 'translateY(5%)', offset: 0.8 }),
          style({ transform: 'translateY(-5%)', offset: 0.9 }),
          style({ transform: 'translateY(0%)', offset: 1 }),
        ])
      ),
    ]),
  ]),
];

export { slides, fade, scales, slips, flips, rotates, shakes, zooms };
