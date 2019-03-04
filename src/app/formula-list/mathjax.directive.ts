import { Directive, ElementRef, Input, OnChanges, OnInit } from '@angular/core';
declare var MathJax;

@Directive({
    selector: '[mathJaxExpr]',
})
export class MathJaxDirective implements OnInit, OnChanges {
    @Input('mathJaxExpr')
    private value = '';

    constructor(private element: ElementRef) {
    }

    ngOnInit() {
        if (this.value) {
            this.element.nativeElement.innerHTML = this.value;
            MathJax.Hub.Queue(['Typeset', MathJax.Hub, this.element.nativeElement]);
        }
    }

    ngOnChanges() {
        if (this.value) {
            this.element.nativeElement.innerHTML = this.value;
            MathJax.Hub.Queue(['Typeset', MathJax.Hub, this.element.nativeElement]);
        }
    }
}
