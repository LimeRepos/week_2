// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "@openzeppelin/contracts/access/Ownable.sol";

contract Library is Ownable {
    event NewBook(uint256 id, string name, uint256 copies);
    event CopiesAdded(uint256 id, string name, uint256 copies);
    event BookBorrowed(uint256 id, uint256 remainingCopies);
    event BookReturned(uint256 id, uint256 remainingCopies);

    struct Book {
        string name;
        uint256 copies;
    }

    // Tracks the amount of books in the library
    uint256 public booksInLibrary;

    //Mapping that helps to manage how many copies of each book are out.
    mapping(uint256 => uint256) public bookIdToCopiesOut;

    // Mapping that saves a boolean if a book id is now borrowed by an address
    mapping(address => mapping(uint256 => bool))
        public addressBookIdCopiesBorrowed;

    // This keeps the order in which the books have been borrowed
    mapping(uint256 => address[]) public borrowers;

    // This is where the book info is stored. THE INDEX OF THE BOOK IN THE ARRAY IS TAKEN AS THE BOOK ID.
    Book[] public bookArray;

    // Owner Functions

    // Adds a new book to the library
    function addNewBook(string memory _name, uint256 _copies) public onlyOwner {
        Book memory _book = Book(_name, _copies);
        bookArray.push(_book);
        booksInLibrary += 1;
        //bookIdToCopiesOut[bookArray.length-1]=0;
        emit NewBook(bookArray.length - 1, _name, _copies);
    }

    // Adds more copies to a book in library by id
    function addCopies(uint256 _id, uint256 _copies) public onlyOwner {
        bookArray[_id].copies = bookArray[_id].copies + _copies;
        emit CopiesAdded(_id, bookArray[_id].name, bookArray[_id].copies);
    }

    // View functions

    //Returns the name of a book by id
    function getName(uint256 _id) public view returns (string memory) {
        require(bookArray.length - 1 >= _id, "No book with this index");
        return bookArray[_id].name;
    }

    // Returns boolean if book is available for borrowing
    function isAvailable(uint256 _id) public view returns (bool) {
        require(bookArray.length - 1 >= _id, "No book with this index");
        return bookArray[_id].copies - bookIdToCopiesOut[_id] > 0;
    }

    // returns the amount of available copies to borrow
    function availableUnits(uint256 _id) public view returns (uint256) {
        require(bookArray.length - 1 >= _id, "No book with this index");
        return bookArray[_id].copies - bookIdToCopiesOut[_id];
    }

    // returns array of book borrowers in chronological order
    function viewBookBorrowers(uint256 _id)
        public
        view
        returns (address[] memory)
    {
        require(bookArray.length - 1 >= _id, "No book with this index");
        return borrowers[_id];
    }

    // Book handleing functions

    // Lets user borrow a book
    function borrowBook(uint256 _id) public {
        require(bookArray.length - 1 >= _id, "No book with this index");
        require(isAvailable(_id), "All copies are out");
        require(
            !addressBookIdCopiesBorrowed[msg.sender][_id],
            "You already have one of those"
        );
        //borrow book
        borrowers[_id].push(msg.sender);
        bookIdToCopiesOut[_id] = bookIdToCopiesOut[_id] + 1;
        addressBookIdCopiesBorrowed[msg.sender][_id] = true;
        emit BookBorrowed(_id, bookArray[_id].copies - bookIdToCopiesOut[_id]);
    }

    //Lets user return a book
    function returnBook(uint256 _id) public {
        require(bookArray.length - 1 >= _id, "No book with this index");
        require(
            addressBookIdCopiesBorrowed[msg.sender][_id],
            "You dont have this book"
        );
        //return book
        bookIdToCopiesOut[_id] = bookIdToCopiesOut[_id] - 1;
        addressBookIdCopiesBorrowed[msg.sender][_id] = false;
        emit BookBorrowed(_id, bookArray[_id].copies - bookIdToCopiesOut[_id]);
    }
}
