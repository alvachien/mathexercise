import { Component, Input, } from '@angular/core';

@Component({
  selector: 'app-printable-quiz-section',
  templateUrl: './printable-quiz-section.component.html',
  styleUrls: ['./printable-quiz-section.component.scss'],
})
export class PrintableQuizSectionComponent {

  @Input() arQuiz: any[];
  @Input() arPlaceHolder: any[];
}
