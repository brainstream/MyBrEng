using DevExpress.Xpo;

namespace DatabaseMigration;

class DestinationUnitOfWork : UnitOfWork
{
    public DestinationUnitOfWork(IDataLayer dataLayer): base(dataLayer)
    {
    }
}
