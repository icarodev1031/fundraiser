const FundraiserContract = artifacts.require("Fundraiser");
contract("Fundraiser",accounts=>{
    console.log(accounts)
    let fundraiser;
    const name = "Beneficiary Name";
    const url = "beneficiaryname.org";
    const imageUrl = "https://placekitten.com/600/350";
    const description = "Beneficiary description";
    const beneficiary = accounts[1];
   
	
    describe("initialization",()=>{
        beforeEach(async()=>{
            fundraiser = await FundraiserContract.new(
                name,
                url,
                imageUrl,
                description,
                beneficiary,
                owner
            );
        })

        it("gets the beneficiary name", async()=>{
            const actual = await fundraiser.name();
            assert.equal(actual, name,"names should match");
        });
        it("gets the beneficiary url", async()=>{
            const actual = await fundraiser.url();
            assert.equal(actual, url,"url should match");
        });
        it("gets the beneficiary image url", async()=>{
            const actual = await fundraiser.imageURL();
            assert.equal(actual, imageUrl,"imageURL should match");
        });
        it("gets the beneficiary description", async()=>{
            const actual = await fundraiser.description();
            assert.equal(actual, description,"description should match");
        });
        it("gets the beneficiary", async()=>{
            const actual = await fundraiser.beneficiary();
            assert.equal(actual, beneficiary,"beneficiary addresses should match");
        });
        it("gets the custodian", async()=>{
            const actual = await fundraiser.owner();
            assert.equal(actual, owner,"bios should match");
        });
        
    })

    describe("setBeneficiary",()=>{
        const newBeneficiary = accounts[2];

        it("updated beneficiary when called by owner account",async()=>{
            await fundraiser.setBeneficiary(newBeneficiary, {from:owner});
            const actualBeneficiary = await fundraiser.beneficiary();
            assert.equal(actualBeneficiary, newBeneficiary,"beneficiaries should match")
        })

        it("throws an error when called from a non-owner account", async()=>{
            try{
                await fundraiser.setBeneficiary(newBeneficiary, {from :accounts[3]});
                assert.fail("withdraw was not restricted to owners")
            }catch(err){
                const expectedError = "Ownable: caller is not the owner"
                const actualError = err.reason;
                assert.equal(actualError, expectedError,"should not be permitted")
            }
        })
    })

    describe("making donations",()=>{
        const value = web3.utils.toWei('0.0289');
        const donor = accounts[2];

        it("increases myDonationsCount",async()=>{
            const currentDonationsCount = await fundraiser.myDonationsCount(
                {from: donor}
            );
            await fundraiser.donate({from:donor,value});

            const newDonationsCount = await fundraiser.myDonationsCount(
                {from:donor}
            );
           
            assert.equal(
                1,
                newDonationsCount - currentDonationsCount,
                "myDonationsCount should increment by 1"
            )
        });
        it("includes donation in myDonations",async()=>{
            await fundraiser.donate({from:donor, value});
            const {values, dates} = await fundraiser.myDonations(
                {from :donor}
            );
            assert.equal(
                value,
                values[0],
                "values should match"
            );
            assert(dates[0], "date should be present");
        });

        it("emits the DonationReceived event", async()=>{
            const tx = await fundraiser.donate({from:donor, value});
            const expectedEvent = "DonationReceived";
            const actualEvent = tx.logs[0].event;
            assert.equal(actualEvent, expectedEvent, "events should match");
        })

    })
})