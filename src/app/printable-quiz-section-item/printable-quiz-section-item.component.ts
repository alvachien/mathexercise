import { Component, Input, } from '@angular/core';

@Component({
  selector: 'app-printable-quiz-section-item',
  templateUrl: './printable-quiz-section-item.component.html',
  styleUrls: ['./printable-quiz-section-item.component.scss'],
})
export class PrintableQuizSectionItemComponent {
  @Input() quizSection: any[];
  @Input() arPlaceHolder: any[];
}
