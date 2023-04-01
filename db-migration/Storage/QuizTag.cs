using System;
using DevExpress.Xpo;

namespace DatabaseMigration
{
    public class QuizTag : XPLiteObject
    {
        private Guid id = default;
        private string title;
        private User owner;

        public QuizTag(Session session) :
            base(session)
        {
        }

        [Key(true)]
        public Guid Id
        {
            get => id;
            set => SetPropertyValue(nameof(Id), ref id, value);
        }

        [Size(100)]
        public string Title
        {
            get => title;
            set => SetPropertyValue(nameof(Title), ref title, value);
        }

        [Association("QuizzesTags", UseAssociationNameAsIntermediateTableName = true)]
        public XPCollection<Quiz> Quizzes
        {
            get => GetCollection<Quiz>(nameof(Quizzes));
        }
        [Association("User-Tags")]
        public User Owner
        {
            get => owner;
            set => SetPropertyValue(nameof(Owner), ref owner, value);
        }
    }
}
