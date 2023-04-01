using System;
using DevExpress.Xpo;

namespace DatabaseMigration
{
    public class RunAnswer : XPLiteObject
    {
        private Guid id = default;
        private Run run;
        private QuizQuestion question;
        private QuizAnswerVariant variant;
        private string text;

        public RunAnswer(Session session) :
            base(session)
        {
        }

        [Key(true)]
        public Guid Id
        {
            get => id;
            set => SetPropertyValue(nameof(Id), ref id, value);
        }

        [Association("Run-Answers")]
        public Run Run
        {
            get => run;
            set => SetPropertyValue(nameof(Run), ref run, value);
        }

        public QuizQuestion Question
        {
            get => question;
            set => SetPropertyValue(nameof(Question), ref question, value);
        }

        public QuizAnswerVariant Variant
        {
            get => variant;
            set => SetPropertyValue(nameof(Variant), ref variant, value);
        }

        [Size(150)]
        public string Text
        {
            get => text;
            set => SetPropertyValue(nameof(Text), ref text, value);
        }
    }
}
