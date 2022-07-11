import { expect } from 'chai'
import { ethers } from 'hardhat'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { Token, Token__factory } from '../typechain-types'

describe('Token Contract', function () {
  let owner: SignerWithAddress
  let addr1: SignerWithAddress
  let addr2: SignerWithAddress
  let addr3: SignerWithAddress
  let token: Token

  this.beforeEach(async () => {
    ;[owner, addr1 , addr2] = await ethers.getSigners()

    let tokenFactory = (await ethers.getContractFactory(
      'Token',
    )) as Token__factory

    let totalSupply = 10000

    token = await tokenFactory.deploy(owner.address, totalSupply)
  })

  describe('deployment', () => {
    it('should assign deployer address to the owner variable', async () => {
      let deployerAddress = owner.address
      expect(deployerAddress).to.equal(await token.owner())
    })

    it('should assign the total supply to the totalSupply variable', async () => {
      let totalSupply_ = 10000
      expect(await token.totalSupply()).to.equal(totalSupply_)
    })
  })

  describe('should assign the totalSupply to the owner', () => {
    it('should assign the total supply of tokens to the owner', async () => {
      let ownerBalance = await token.balanceOf(owner.address)
      expect(await token.totalSupply()).to.equal(ownerBalance)
    })
  })

  describe('Transactions', function () {
    it("Should transfer tokens between accounts", async function () {
    	// Transfer 50 tokens from owner to addr1
    	await token.transfer(addr1.address, 50);
    	const addr1Balance = await token.balanceOf(addr1.address);
    	expect(addr1Balance).to.equal(50);

    	// Transfer 50 tokens from addr1 to addr2
    	// We use .connect(signer) to send a transaction from another account
    	await token.connect(addr1).transfer(addr2.address, 50);
    	const addr2Balance = await token.balanceOf(addr2.address);
    	expect(addr2Balance).to.equal(50);
    });

    it('should fail if sender does not have enough tokens', async () => {
      let initialBalance = await token.balanceOf(owner.address)

      await expect(
        token.connect(addr1).transfer(owner.address, 1),
      ).to.be.revertedWith('not enough tokens')

      expect(await token.balanceOf(owner.address)).to.equal(initialBalance)
    })

    it('should update balances after transfers', async () => {
      let initialOwnerBalance = await token.balanceOf(owner.address)

      // transfer 100 tokens from owner to addr1
      await token.transfer(addr1.address, 100)

      // transfer 50 tokens from owner to addr2
      await token.transfer(addr2.address, 50)

      let finalOwnerBalance = await token.balanceOf(owner.address)
      expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150))

      let addr1Balance = await token.balanceOf(addr1.address)
      expect(addr1Balance).to.equal(100)

      let addr2Balance = await token.balanceOf(addr2.address)
      expect(addr2Balance).to.equal(50)
    })
  })
})
