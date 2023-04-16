from dependency_injector import containers, providers
from facades import QuizFacade, UserFacade, QuizQuestionFacade


class DI(containers.DeclarativeContainer):
    wiring_config = containers.WiringConfiguration(modules=[
        'blueprints.quiz_blueprint',
        'blueprints.account_blueprint'
    ])
    config = providers.Configuration()
    quiz_facade = providers.Factory(QuizFacade)
    quiz_question_facade = providers.Factory(QuizQuestionFacade)
    user_facade = providers.Factory(UserFacade)
