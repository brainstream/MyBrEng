using System;
using DevExpress.Xpo;

namespace DatabaseMigration
{
    public class Run: XPLiteObject
    {
        private Guid id = default;
        private Student student;
        private Quiz quiz;
        private DateTime creationDate;
        private DateTime? startDate;
        private DateTime? finishDate;

        public Run(Session session) :
            base(session)
        {
        }

        [Key(true)]
        public Guid Id
        {
            get => id;
            set => SetPropertyValue(nameof(Id), ref id, value);
        }

        [Association("Student-Runs")]
        public Student Student
        {
            get => student;
            set => SetPropertyValue(nameof(Student), ref student, value);
        }

        [Association("Quiz-Runs")]
        public Quiz Quiz
        {
            get => quiz;
            set => SetPropertyValue(nameof(Quiz), ref quiz, value);
        }

        [Aggregated, Association("Run-Answers")]
        public XPCollection<RunAnswer> Answers
        {
            get => GetCollection<RunAnswer>(nameof(Answers));
        }

        public DateTime CreationDate
        {
            get => creationDate;
            set => SetPropertyValue(nameof(CreationDate), ref creationDate, value);
        }

        public DateTime? StartDate
        {
            get => startDate;
            set => SetPropertyValue(nameof(StartDate), ref startDate, value);
        }

        public DateTime? FinishDate
        {
            get => finishDate;
            set => SetPropertyValue(nameof(FinishDate), ref finishDate, value);
        }
    }
}
