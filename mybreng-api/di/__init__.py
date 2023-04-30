from dependency_injector import containers, providers
from facades import QuizFacade, UserFacade, QuizQuestionFacade, StudentFacade


class DI(containers.DeclarativeContainer):
    wiring_config = containers.WiringConfiguration(modules=[
        'blueprints.quiz_blueprint',
        'blueprints.account_blueprint',
        'blueprints.student_blueprint',
    ])
    config = providers.Configuration()
    quiz_facade = providers.Factory(QuizFacade)
    quiz_question_facade = providers.Factory(QuizQuestionFacade)
    user_facade = providers.Factory(UserFacade)
    student_facade = providers.Factory(StudentFacade)
