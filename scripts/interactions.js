//import { ethers } from "hardhat";
const hre = require("hardhat");

const address = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

const run = async function() {
    // Connect to deployed contract
    const Library = await hre.ethers.getContractFactory("Library");
    const libraryContract = Library.attach(address)
    // Connect to provider
    const provider = new hre.ethers.providers.JsonRpcProvider("http://localhost:8545")
    const wallet = new hre.ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);
    //checkAvailableBooks(libraryContract)
    //await rentBook(libraryContract, 2)
    //checkAvailableBooks(libraryContract)
    
    //console.log(await checkRental(libraryContract,2,wallet.address))
    //await returnBook(libraryContract, 2)
    //console.log(await checkRental(libraryContract,2,wallet.address))
    //console.log(await checkAvailable(libraryContract, 0))

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
    let tx = await libraryContract.borrowBook(id)
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