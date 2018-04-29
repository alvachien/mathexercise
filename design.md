# OVERALL

# Hierarchy of Classes
QuizItem (abstract)
    PrimarySchoolMathQuizItem
        PrimarySchoolMathFAOQuizItem
            AdditionQuizItem
            SubtractionQuizItem
            MultiplicationQuizItem
            DivisionQuizItem
        FormulaQuizItemBase
            FormulaCOfCircleQuizItem
            FormulaCOfSquareQuizItem
            FormulaCOfRectangleQuizItem
            FormulaDistAndSpeedQuizItem
            FormulaAreaOfRectangleQuizItem
            FormulaAreaOfSquareQuizItem
            FormulaEfficiencyProblemQuizItem
        Cal24QuizItem
        SudouQuizItem

QuizBasicControl
    PrimarySchoolMathFAOControl

PrimarySchoolMathQuizSection

PrimarySchoolMathQuiz

# BREAK CHANGES
## Quiz Control
Table: **AwardPlan**, add one new column **quizcontrol**, with type nvarchar, length 250; The value of this column is the JSON string for Quiz control;

Table: **Quiz**, enlarge column **basicinfo** to 250 with type unchanged. The meaning here now is the JSON string for Quiz control;

## Serialization of Quiz Items
Table **QuizFailLog**, enlarge column **expected** and **inputted**, both to length 250 with type unchanged. The meaning of those two columns are JSON object for failed item.

## Others

# Others