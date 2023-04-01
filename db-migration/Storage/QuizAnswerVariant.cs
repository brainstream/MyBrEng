using System;
using DevExpress.Xpo;

namespace DatabaseMigration
{
    public class QuizAnswerVariant : XPLiteObject
    {
        private Guid id = default;
        private QuizQuestion question;
        private string text;
        private bool isRight;

        public QuizAnswerVariant(Session session) :
            base(session)
        {
        }

        [Key(true)]
        public Guid Id
        {
            get => id;
            set => SetPropertyValue(nameof(Id), ref id, value);
        }

        [Association("QuizQuestion-AnswerVariants")]
        public QuizQuestion Question
        {
            get => question;
            set => SetPropertyValue(nameof(Question), ref question, value);
        }

        [Size(150)]
        public string Text
        {
            get => text;
            set => SetPropertyValue(nameof(Text), ref text, value);
        }

        public bool IsRight
        {
            get => isRight;
            set => SetPropertyValue(nameof(IsRight), ref isRight, value);
        }
    }
}
