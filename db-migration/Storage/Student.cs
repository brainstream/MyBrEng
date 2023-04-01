using System;
using DevExpress.Xpo;

namespace DatabaseMigration
{
    public class Student : XPLiteObject
    {
        private Guid id = default;
        private string firstName;
        private string lastName;
        private User owner;
        private string note;

        public Student(Session session) :
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
        public string FirstName
        {
            get => firstName;
            set => SetPropertyValue(nameof(FirstName), ref firstName, value);
        }

        [Size(100)]
        public string LastName
        {
            get => lastName;
            set => SetPropertyValue(nameof(LastName), ref lastName, value);
        }

        [Aggregated, Association("Student-Runs")]
        public XPCollection<Run> Runs
        {
            get => GetCollection<Run>(nameof(Runs));
        }

        [Association("User-Students")]
        public User Owner
        {
            get => owner;
            set => SetPropertyValue(nameof(Owner), ref owner, value);
        }

        [Size(SizeAttribute.Unlimited)]
        public string Note
        {
            get => note;
            set => SetPropertyValue(nameof(Note), ref note, value);
        }
    }
}
