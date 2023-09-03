import unittest
from drivers import Firefox
from website.page import Login


class TestBase(unittest.TestCase):
    def setUp(self):
        self.driver = Firefox()

    def tearDown(self):
        self.driver.close()

    def login(self):
        Login(self.driver).login()
