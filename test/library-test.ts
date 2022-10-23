import { expect } from "chai";
import { ethers } from "hardhat";

describe("Library", function () {

    async function deployLibrary() {
    
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();
    
        const Library = await ethers.getContractFactory("Library");
        const lib = await Library.deploy();
    
        return { lib, owner, otherAccount };
    }

    async function deployWithAddedBook(){
        const [owner, otherAccount] = await ethers.getSigners();
        const name = "Random Book";
        const copies = 5;
    
        const Library = await ethers.getContractFactory("Library");
        const lib = await Library.deploy();
        await lib.addNewBook(name, copies);
    
        return { lib, owner, otherAccount, name, copies };
    }

    async function deployWithAddedBookBorrowed(){
      const [owner, otherAccount] = await ethers.getSigners();
      const name = "Random Book";
      const copies = 5;
  
      const Library = await ethers.getContractFactory("Library");
      const lib = await Library.deploy();
      await lib.addNewBook(name, copies);
      await lib.connect(otherAccount).borrowBook(0)
  
      return { lib, owner, otherAccount, name, copies };
  }

    describe("Deployment", function () {
        it("Should set the owner", async function () {
          const { lib, owner } = await deployLibrary();
    
          expect(await lib.owner()).to.equal(owner.address);
        });

        it("Should have a book", async function () {
          const { lib, name, copies } = await deployWithAddedBook();
          expect((await lib.bookArray(0))[0]).to.equal(name);
          expect((await lib.bookArray(0))[1]).to.equal(copies);
        })
      });

    describe("OwnerFunctions", function () {
      it("Should add book", async function () {
        const { lib } = await deployLibrary();
        await lib.addNewBook("Random Book", 5);
        expect((await lib.bookArray(0))[0]).to.equal("Random Book");
        expect((await lib.bookArray(0))[1]).to.equal(5);
      });

      it("Should not add book not owner", async function () {
        const { lib, otherAccount } = await deployLibrary();
        expect(lib.connect(otherAccount).addNewBook("Random Book", 5)).to.be.revertedWith('Ownable: caller is not the owner')
      })

      it("Should add copies", async function () {
        const { lib, owner, otherAccount, name, copies } = await deployWithAddedBook();
        const copiesToAdd = 2;
        await lib.addCopies(0, copiesToAdd);
        expect((await lib.bookArray(0))[1]).to.equal(copies + copiesToAdd);
      })

      it("Should not add copies", async function () {
        const copiesToAdd = 2;
        const { lib, owner, otherAccount, name, copies } = await deployWithAddedBook();
        expect(lib.connect(otherAccount).addCopies(0,copiesToAdd)).to.be.revertedWith('Ownable: caller is not the owner')

      })
      
    });

    describe("Borrows and returns ", function () {
      it("Should Borrow book", async function () {
        const { lib, owner, otherAccount, name, copies } = await deployWithAddedBook();
        const bookId = 0;
        await lib.connect(otherAccount).borrowBook(bookId)
        expect(await lib.bookIdToCopiesOut(bookId)).to.equal(1)
        expect(await lib.addressBookIdCopiesBorrowed(otherAccount.address,bookId)).to.equal(true)
        expect(await lib.borrowers(bookId,0)).to.equal(otherAccount.address)
      });

      it("Should Return book", async function () {
        const { lib, owner, otherAccount, name, copies } = await deployWithAddedBook();
        const bookId = 0;
        await lib.connect(otherAccount).borrowBook(bookId)
        await lib.connect(otherAccount).returnBook(bookId)
        expect(await lib.bookIdToCopiesOut(bookId)).to.equal(0)
        expect(await lib.addressBookIdCopiesBorrowed(otherAccount.address,bookId)).to.equal(false)
        expect(await lib.borrowers(bookId,0)).to.equal(otherAccount.address)
      })

      it("Should revert book borrow", async function () {
        const { lib, owner, otherAccount, name, copies } = await deployWithAddedBookBorrowed();
        const bookId = 0;
        expect(lib.connect(otherAccount).borrowBook(5)).to.be.revertedWith('No book with this index')
        expect(lib.connect(otherAccount).borrowBook(0)).to.be.revertedWith('You already have one of those')
      })

      it("Should revert book return", async function () {
        const { lib, owner, otherAccount, name, copies } = await deployWithAddedBookBorrowed();
        const bookId = 0;
        expect(lib.connect(otherAccount).returnBook(5)).to.be.revertedWith('No book with this index')
        expect(lib.returnBook(0)).to.be.revertedWith('You dont have this book')
      })
    })
    

    describe("Check view functions", function () {
      it("Should get book name", async function () {
        const { lib, owner, otherAccount, name, copies } = await deployWithAddedBookBorrowed();
        expect(await lib.getName(0)).to.equal(name)
        expect(lib.getName(5)).to.be.revertedWith('No book with this index')
      });

      it("Should be available to borrow", async function () {
        const { lib, owner, otherAccount, name, copies } = await deployWithAddedBookBorrowed();
        expect(await lib.isAvailable(0)).to.equal(true)
        expect(lib.isAvailable(5)).to.be.revertedWith('No book with this index')
        expect(await lib.availableUnits(0)).to.equal(copies-1)
        expect(lib.availableUnits(5)).to.be.revertedWith('No book with this index')
        expect((await lib.viewBookBorrowers(0))[0]).to.equal(otherAccount.address)
        expect(lib.viewBookBorrowers(5)).to.be.revertedWith('No book with this index')
      });

      it("Should not be available to borrow", async function () {
        const { lib, owner, otherAccount, name, copies } = await deployWithAddedBookBorrowed();
        await lib.addNewBook("Random Book2", 1);
        expect(await lib.availableUnits(1)).to.equal(1)
        await lib.connect(otherAccount).borrowBook(1)
        expect((await lib.viewBookBorrowers(1))[0]).to.equal(otherAccount.address)
        expect(await lib.availableUnits(1)).to.equal(0)
        expect(await lib.isAvailable(1)).to.equal(false)
        expect(lib.borrowBook(1)).to.be.revertedWith('All copies are out')

      })


    })

})