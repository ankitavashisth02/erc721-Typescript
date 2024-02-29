// SPDX-License-Identifier: MIT
pragma  solidity <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
//import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

contract MyNFT is ERC721URIStorage , Ownable, ERC721Enumerable {
  //  using Counters for Counters.Counter;
  //  Counters.Counter public _tokenIds;
    uint256 public currentPrice = 1000000000000000;
    uint public tokenId1;

    constructor() ERC721("Testnet","TEST") Ownable(msg.sender) payable {}

    function mintNFT(string memory _tokenURI) public payable returns(uint256) {
        //_tokenIds.increment();

        uint256 newItemId = tokenId1++;
        _safeMint(msg.sender, newItemId);
        deductBalance();
        _setTokenURI(newItemId, _tokenURI);
        return newItemId;
    }

    function deductBalance() private {
        uint256 totalSupp = totalSupply();
        currentPrice = (1000000000000000000*totalSupp*totalSupp)/16000;
    }

    function burn1(uint _tokenId) public {
        _tokenId--;
        _update(address(0),_tokenId,_msgSender());
        tokenId1--;
        deductBalance();
        payable(msg.sender).transfer(currentPrice);
    }

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}