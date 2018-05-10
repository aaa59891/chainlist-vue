pragma solidity ^0.4.18;

contract ChainList {
  //state variables
  address seller;
  address buyer;
  string name;
  string description;
  uint256 price;

  event LogSellArticle(
    address indexed _seller,
    string _name,
    string _description,
    uint256 _price
  );

  event LogBuyArticle(
    address indexed _seller,
    address indexed _buyer,
    string _name,
    uint256 _price
  );

  //sell an article
  function sellArticle(string _name, string _description, uint256 _price) public{
    seller = msg.sender;
    name = _name;
    description = _description;
    price = _price;

    LogSellArticle(seller, name, description, price);
  }

  //get an article
  function getArticle() public view returns(
    address _seller,
    address _buyer,
    string _name,
    string _description, 
    uint256 _price
  ){
    return (seller, buyer, name, description, price);
  }

  // buy an article
  function buyArticle() payable public{
    // check the article is ready for sale
    require(seller != 0x0);

    // check the article has not been sold
    require(buyer == 0x0);

    // check the buyer is not the same as the seller
    require(msg.sender != seller);

    // check the value is the same as the price
    require(msg.value == price);

    buyer = msg.sender;

    seller.transfer(msg.value);

    LogBuyArticle(seller, buyer, name, price);
  }
}