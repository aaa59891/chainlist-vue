pragma solidity ^0.4.18;

contract ChainList {
  
  struct Article{
    uint id;
    address seller;
    address buyer;
    string name;
    string description;
    uint256 price;
  }

  //state variables
  mapping (uint => Article) public articles;
  uint articlesCount;

  event LogSellArticle(
    uint indexed _id,
    address indexed _seller,
    string _name,
    string _description,
    uint256 _price
  );

  event LogBuyArticle(
    uint indexed _id,
    address indexed _seller,
    address indexed _buyer,
    string _name,
    uint256 _price
  );

  //sell an article
  function sellArticle(string _name, string _description, uint256 _price) public{
    articlesCount++;
    articles[articlesCount] = Article(
      articlesCount,
      msg.sender,
      0x0,
      _name,
      _description,
      _price
    );
    LogSellArticle(articlesCount, msg.sender, _name, _description, _price);
  }

  function getArticlesCount() public view returns(uint){
    return articlesCount;
  }

  function getSellArticleIds() public view returns(uint[]){
    uint[] memory ids = new uint[](articlesCount);
    uint counter = 0;
    for(uint i = 1; i <= articlesCount; i++){
      if(articles[i].buyer == 0x0){
        ids[counter] = articles[i].id;
        counter++;
      }
    }

    uint[] memory result = new uint[](counter);
    for(uint j = 0; j < counter; j++){
      result[j] = ids[j];
    }
    return result;
  }

  // buy an article
  function buyArticle(uint _id) payable public{
    require(articlesCount >= _id);
    Article storage article = articles[_id];

    // check the article has not been sold
    require(article.buyer == 0x0);

    // check the buyer is not the same as the seller
    require(msg.sender != article.seller);

    // check the value is the same as the price
    require(msg.value == article.price);

    article.buyer = msg.sender;

    article.seller.transfer(msg.value);

    LogBuyArticle(_id, article.seller, article.buyer, article.name, article.price);
  }
}