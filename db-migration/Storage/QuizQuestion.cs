using System;
using DevExpress.Xpo;

namespace DatabaseMigration
{
    public enum QuizQuestionType
    {
        SingleChoice = 0,
        MultipleChoice = 1,
        FreeText = 2
    }

    public class QuizQuestion : XPLiteObject
    {
        private Guid id = default;
        private string text;
        private Quiz quiz;
        private QuizQuestionType type;
        private int ordinalNumber;

        public QuizQuestion(Session session) :
            base(session)
        {
        }

        [Key(true)]
        public Guid Id
        {
            get => id;
            set => SetPropertyValue(nameof(Id), ref id, value);
        }

        [Size(SizeAttribute.Unlimited)]
        public string Text
        {
            get => text;
            set => SetPropertyValue(nameof(Text), ref text, value);
        }

        [Association("Quiz-Questions")]
        public Quiz Quiz
        {
            get => quiz;
            set => SetPropertyValue(nameof(Quiz), ref quiz, value);
        }

        public QuizQuestionType Type
        {
            get => type;
            set => SetPropertyValue(nameof(Type), ref type, value);
        }

        public int OrdinalNumber
        {
            get => ordinalNumber;
            set => SetPropertyValue(nameof(OrdinalNumber), ref ordinalNumber, value);
        }

        [Association("QuizQuestion-AnswerVariants"), Aggregated]
        public XPCollection<QuizAnswerVariant> AnswerVariants
        {
            get => GetCollection<QuizAnswerVariant>(nameof(AnswerVariants));
        }
    }
}
