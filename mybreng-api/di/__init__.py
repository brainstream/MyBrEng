from dependency_injector import containers, providers
from facades import QuizFacade


class DI(containers.DeclarativeContainer):
    wiring_config = containers.WiringConfiguration(modules=[
        'blueprints.quiz.quiz_blueprints'
    ])
    config = providers.Configuration()
    quiz_facade = providers.Factory(QuizFacade)
