import smartpy as sp

class CarRentMarket(sp.Contract):
    # initialize the fields and sets up the storage
    def __init__(self):
        self.init(
            owner=sp.address('tz1gSkcoUrShtJVP7jV26FgTMagCeEXBkajT'), 
            carList=sp.map()
        )

    # insert a new car into the list
    @sp.entry_point
    def addCar(self, params):
        sp.verify(sp.sender == self.data.owner, message='Only owner can add cars.')
        self.checkCarAlreadyExits(params) 
        self.data.carList[params._carNumber] = sp.record(
            carName = params._carName,
            renter = self.data.owner, 
            rent = sp.utils.nat_to_tez(params._rent), 
            description = params._description, 
            deposit = sp.utils.nat_to_tez(params._deposit), 
            available = sp.bool(True), 
            paidRents = sp.list(), 
            comment = sp.list())

    # delete one car from list
    @sp.entry_point
    def deleteCar(self,params):
        sp.verify(sp.sender == self.data.owner, message='Only owner can delete cars.')
        sp.verify(self.data.carList[params._carNumber].available == True,  message="The car has been rented out.You can't delete it!")
        sp.if ~(self.data.carList.contains(params._carNumber)):
            sp.failwith('Car does not exists.')
        sp.else:
            del self.data.carList[params._carNumber]

    # update car's information
    @sp.entry_point
    def update(self, params):
        sp.verify(sp.sender == self.data.owner, message='Only owner can update information.')
        sp.if ~(self.data.carList.contains(params._carNumber)):
            sp.failwith('Car does not exists.')
        sp.else:
            self.data.carList[params._carNumber].carName = params._newName
            self.data.carList[params._carNumber].rent = sp.utils.nat_to_tez(params._newRent)
            self.data.carList[params._carNumber].description = params._newDescription
            self.data.carList[params._carNumber].deposit = sp.utils.nat_to_tez(params._newDeposit)

    # sign contract before rent car and pay the deposit
    @sp.entry_point
    def signContract(self, params):
        sp.if ~(self.data.carList.contains(params._carNumber)):
            sp.failwith('Car does not exists.')
        sp.verify(sp.sender != self.data.owner, message='Owner Cannot Be renter.')
        sp.verify(self.data.carList[params._carNumber].available == True,  message="Car Already Rented Out.")
        sp.verify(self.data.carList[params._carNumber].deposit <= sp.amount, message="A sufficient deposit is required when signing the contract")
        self.data.carList[params._carNumber].available = False
        self.data.carList[params._carNumber].renter = sp.sender

        # Return extra tez deposit to the sender
        extra_deposit = sp.amount - self.data.carList[params._carNumber].deposit
        sp.if extra_deposit > sp.tez(0):
            sp.send(sp.sender, extra_deposit)

    # after signing contract, the renter can pay rent to the onwer.
    @sp.entry_point
    def payRent(self, params):
        sp.verify(self.data.carList[params._carNumber].available == False, message = "You should sign contract with the car owner first.")
        sp.verify(self.data.carList[params._carNumber].renter == sp.sender, message = "Only renter can pay the rent.")
        sp.verify(self.data.carList[params._carNumber].rent == sp.amount, message = "You should pay right amount of rent.")
        sp.send(self.data.owner, self.data.carList[params._carNumber].rent)
        #record the payment time
        self.data.carList[params._carNumber].paidRents.push(
            sp.timestamp_from_utc_now())

    # car owner end contract with car renter
    @sp.entry_point
    def endContract(self, params):
        sp.verify(sp.sender == self.data.owner, message = 'Only owner can end contract.')
        #send the deposit back to renter when ending contract
        sp.send(self.data.carList[params._carNumber].renter, self.data.carList[params._carNumber].deposit)
        self.data.carList[params._carNumber].renter = self.data.owner
        self.data.carList[params._carNumber].available = True
        self.data.carList[params._carNumber].paidRents = sp.list()

    # renter can make comments to the car
    @sp.entry_point
    def makeComment(self, params):
        sp.if (sp.sender != self.data.carList[params._carNumber].renter):
            sp.failwith("Only renter can make comments.")
        sp.else:
            self.data.carList[params._carNumber].comment.push(params._comment)

    # check whether the car number exists
    def checkCarAlreadyExits(self, params):
        sp.if self.data.carList.contains(params._carNumber):
            sp.failwith('Car already in the list.')

@sp.add_test(name = "test")
def test():
    scenario = sp.test_scenario()

    #test account
    owner = sp.address('tz1gSkcoUrShtJVP7jV26FgTMagCeEXBkajT')
    alice = sp.test_account("alice")
    bob = sp.test_account("bob")

    #contract instance
    scenario.h1("Car Rental Market")
    crn = CarRentMarket()
    scenario += crn

    scenario.h2("Add 1st Car (valid test)")
    scenario += crn.addCar(
        _carNumber = 'car0001', 
        _carName = 'Car1',
        _rent = 99,
        _description = 'Fiat 500 with 4 seat. Manual.',
        _deposit = 200
    ).run(sender = owner)

    scenario.h2("Add 2nd Car (valid test)")
    scenario += crn.addCar(
        _carNumber = 'car0002', 
        _carName = 'Car2',
        _rent = 150,
        _description = 'BMW 2 Series Coupe with 4 seat. Automatic.',
        _deposit = 300
    ).run(sender = owner)

    
    scenario.h2("Add car that already exists (failure test)")
    scenario += crn.addCar(
        _carNumber = 'car0001', 
        _carName = 'Car1',
        _rent = 99,
        _description = 'Fiat 500 with 4 seat. Manual.',
        _deposit = 200
    ).run(sender = owner, valid = False)

    scenario.h2("Add car with non-owner account (failure test)")
    scenario += crn.addCar(
        _carNumber = 'car0003', 
        _carName = 'Car3',
        _rent = 110,
        _description = 'Fiat 500 with 4 seat. Automatic.',
        _deposit = 200
    ).run(sender = alice, valid = False)

    scenario.h2("Update 1st Car information (valid test)")
    scenario += crn.update(
        _carNumber = 'car0001', 
        _newName = 'Car1',
        _newRent = 120, 
        _newDescription = 'Fiat 500 with 5 seat. Manual.',
        _newDeposit = 300
    ).run(sender = owner)

    scenario.h2("Update a non-exist car information (failure test)")
    scenario += crn.update(
        _carNumber = 'car0005', 
        _newName = 'Car1',
        _newRent = 120, 
        _newDescription = 'Fiat 500 with 5 seat. Manual.',
        _newDeposit = 300
    ).run(sender = owner, valid = False)

    scenario.h2("Update 1st car information with non-owner account (failure test)")
    scenario += crn.update(
        _carNumber = 'car0001', 
        _newName = 'Car1',
        _newRent = 112, 
        _newDescription = 'Fiat 500 with 5 seat. Manual.',
        _newDeposit = 150
    ).run(sender = bob, valid = False)

    scenario.h2("Sign contract with 1st renter (valid test)")
    scenario += crn.signContract(_carNumber = 'car0001').run(
        sender = alice, amount = sp.tez(500))

    scenario.h2("Sign contract with Owner Account (failure test)")
    scenario += crn.signContract(_carNumber = 'car0002').run(
        sender = owner, amount = sp.tez(300), valid = False)

    scenario.h2("Sign contract without deposit (failure test)")
    scenario += crn.signContract(_carNumber = 'car0002').run(
        sender = bob, amount = sp.tez(0), valid = False)

    scenario.h2("Sign contract with already rented out car (failure test)")
    scenario += crn.signContract(_carNumber = 'car0001').run(
        sender = bob, amount = sp.tez(200), valid = False)

    scenario.h2("Pay rent 1st Car (valid test)")
    scenario += crn.payRent(_carNumber = 'car0001').run(sender = alice, amount = sp.tez(120))

    scenario.h2("Pay rent with wrong amount (failure test)")
    scenario += crn.payRent(_carNumber = 'car0001').run(sender = alice, amount = sp.tez(0), valid = False)

    scenario.h2("Pay rent with car without contract (failure test)")
    scenario += crn.payRent(_carNumber = 'car0002').run(sender = bob, amount = sp.tez(150), valid = False)

    scenario.h2("Pay rent with wrong renter (failure test)")
    scenario += crn.payRent(_carNumber = 'car0001').run(sender = bob, amount = sp.tez(99), valid = False)

    scenario.h2("Make comments (valid test)")
    scenario += crn.makeComment(
        _carNumber = 'car0001',
        _comment = 'The car is pretty good.'
    ).run(sender = alice)

    scenario.h2("Make comments with non-renter account (failure test)")
    scenario += crn.makeComment(
        _carNumber = 'car0001',
        _comment = 'The car is pretty good.'
    ).run(sender = bob, valid = False)

    scenario.h2("Delete car using non-owner account (failure test)")
    scenario += crn.deleteCar(_carNumber = 'car0002').run(sender = alice,valid = False)

    scenario.h2("Delete rented out car (failure test)")
    scenario += crn.deleteCar(_carNumber = 'car0001').run(sender = owner, valid = False)

    scenario.h2("Delete car (vaild test)")
    scenario += crn.deleteCar(_carNumber = 'car0002').run(sender = owner)

    scenario.h2("End contract using non-owner account (failure test)")
    scenario += crn.endContract(_carNumber = 'car0001').run(
        sender = alice, valid = False)

    scenario.h2("End contracts using owner account (valid test)")
    scenario += crn.endContract(_carNumber = 'car0001').run(sender = owner)




