using DevExpress.Xpo;

namespace DatabaseMigration;

class SourceUnitOfWork : UnitOfWork
{
    public SourceUnitOfWork(IDataLayer dataLayer): base(dataLayer)
    {
    }
}
