//import { ethers } from "hardhat";
const hre = require("hardhat");

const address = "0xD771d3De0B4A8C55B32c88422c67aeA783f53760";

const run = async function() {
    // Connect to deployed contract
    const Library = await hre.ethers.getContractFactory("Library");
    const libraryContract = Library.attach(address)
    
    const [deployer] = await ethers.getSigners();
    //await createBook(libraryContract)
    //await createBook(libraryContract)
    //await createBook(libraryContract)
    //checkAvailableBooks(libraryContract)
    //await rentBook(libraryContract, 0)
    //console.log(await checkRental(libraryContract,2,deployer.address))
    //await returnBook(libraryContract, 2)
    console.log(await checkRental(libraryContract,2,deployer.address))
    console.log(await checkAvailable(libraryContract, 0))
    checkAvailableBooks(libraryContract)

}

const createBook = async function(libraryContract){
    const tx = await libraryContract.addNewBook("Random Book", 5);
    const tr = await tx.wait()
    if (tr.status != 1) { // 1 means success
        console.log("Creation not successful") 
        return
    }
    console.log("Creation successful") 
    return
}

const checkAvailableBooks = async function(libraryContract){
    let books = await libraryContract.booksInLibrary()
    books = books.toString()
    let name = ""
    let available = 0
    for(let i = 0; i < books; i++){
        available = await libraryContract.availableUnits(i)
        name = await libraryContract.getName(i)
        console.log("Book name: " + name + ", Available copies: "+ available)
    }
}

const rentBook = async function(libraryContract, id){
    console.log("renting book")
    let tx = await libraryContract.borrowBook(id)
    console.log(tx)
    let tr = await tx.wait()
    if (tr.status != 1) { // 1 means success
        console.log("Borrow not successful") 
        return
    }
    console.log("Borrow successful") 
    return

}

const checkRental = async function(libraryContract, id, address){
    let isRented = await libraryContract.addressBookIdCopiesBorrowed(address, id)
    return isRented
}

const returnBook = async function(libraryContract, id){
    let tx = await libraryContract.returnBook(id)
    let tr = await tx.wait()
    if (tr.status != 1) { // 1 means success
        console.log("Return not successful") 
        return
    }
    console.log("Return successful") 
    return
}

const checkAvailable = async function(libraryContract, id){
    let units = await libraryContract.availableUnits(id);
    return units
}

run()