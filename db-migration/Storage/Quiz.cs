using System;
using DevExpress.Xpo;

namespace DatabaseMigration
{
    public class Quiz : XPLiteObject
    {
        private Guid id = default;
        private string title;
        private string description;
        private User owner;

        public Quiz(Session session) :
            base(session)
        {
        }

        [Key(true)]
        public Guid Id
        {
            get => id;
            set => SetPropertyValue(nameof(Id), ref id, value);
        }

        [Size(250)]
        public string Title
        {
            get => title;
            set => SetPropertyValue(nameof(Title), ref title, value);
        }

        [Size(SizeAttribute.Unlimited)]
        public string Description
        {
            get => description;
            set => SetPropertyValue(nameof(Description), ref description, value);
        }

        [Aggregated, Association("Quiz-Questions")]
        public XPCollection<QuizQuestion> Questions
        {
            get => GetCollection<QuizQuestion>(nameof(Questions));
        }

        [Aggregated, Association("Quiz-Runs")]
        public XPCollection<Run> Runs
        {
            get => GetCollection<Run>(nameof(Runs));
        }

        [Association("User-Quizzes")]
        public User Owner
        {
            get => owner;
            set => SetPropertyValue(nameof(Owner), ref owner, value);
        }

        [Association("QuizzesTags", UseAssociationNameAsIntermediateTableName = true)]
        public XPCollection<QuizTag> Tags
        {
            get => GetCollection<QuizTag>(nameof(Tags));
        }
    }
}
