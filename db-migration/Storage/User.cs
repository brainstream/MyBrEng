using System;
using DevExpress.Xpo;

namespace DatabaseMigration
{
    public class User : XPLiteObject
    {
        private Guid id = default;
        private string email;
        private string passwordHash;
        private string passwordSalt;

        public User(Session session) :
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
        public string Email
        {
            get => email;
            set => SetPropertyValue(nameof(Email), ref email, value);
        }

        [Size(128)]
        public string PasswordHash
        {
            get => passwordHash;
            set => SetPropertyValue(nameof(PasswordHash), ref passwordHash, value);
        }

        [Size(32)]
        public string PasswordSalt
        {
            get => passwordSalt;
            set => SetPropertyValue(nameof(PasswordSalt), ref passwordSalt, value);
        }

        [Aggregated, Association("User-Students")]
        public XPCollection<Student> Students
        {
            get => GetCollection<Student>(nameof(Students));
        }

        [Aggregated, Association("User-Quizzes")]
        public XPCollection<Quiz> Quizzes
        {
            get => GetCollection<Quiz>(nameof(Quizzes));
        }

        [Aggregated, Association("User-Tags")]
        public XPCollection<QuizTag> Tags
        {
            get => GetCollection<QuizTag>(nameof(Tags));
        }
    }
}
