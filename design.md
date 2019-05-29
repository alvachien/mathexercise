# OVERALL
Interface **IStorableObject** defines the object which need be stored.

Abstract class **StorableObject** implements that interface and served as the base class.

# Hierarchy of Classes
- QuizItem (abstract)
    - PrimarySchoolMathQuizItem
        - PrimarySchoolMathFAOQuizItem
            1. AdditionQuizItem
            2. SubtractionQuizItem
            3. MultiplicationQuizItem
            4. DivisionQuizItem
        - FormulaQuizItemBase
            1. FormulaCOfCircleQuizItem
            2. FormulaCOfSquareQuizItem
            3. FormulaCOfRectangleQuizItem
            4. FormulaDistAndSpeedQuizItem
            5. FormulaAreaOfRectangleQuizItem
            6. FormulaAreaOfSquareQuizItem
            7. FormulaEfficiencyProblemQuizItem
        - Cal24QuizItem
        - SudouQuizItem

- QuizBasicControl
    - PrimarySchoolMathFAOControl

- PrimarySchoolMathQuizSection

- PrimarySchoolMathQuiz

# BREAK CHANGES
## Quiz Control
Table: **AwardPlan**, add one new column **quizcontrol**, with type nvarchar, length 250; The value of this column is the JSON string for Quiz control;

Table: **Quiz**, enlarge column **basicinfo** to 250 with type unchanged. The meaning here now is the JSON string for Quiz control;

## Serialization of Quiz Items
Table **QuizFailLog**, enlarge column **expected** and **inputted**, both to length 250 with type unchanged. The meaning of those two columns are JSON object for failed item.

## Others

# Mathematcis 数学
- Elementary mathematics 初等数学
    - Elementary arithmetic 算术
        - Addition
        - Subtraction
        - Multiplication
        - Division
    - Elementary algebra 初等代数
        - Linear equations  一次方程
        - Quadratic equations 一元二次方程
        - Exponential and logarithmic equations 幂和对数方程
        - Radical equations 平方根
        - System of linear equations 线性方程组
- Further Mathematics 高等数学


# Author
Alva Chien (Hongjun Qian)

# License
MIT
