const router = require("express").Router();
const {Customer, Invoice, Invoice_items, Item, Price} = require("../../models")

// get routes for debugging purposes

router.get('/', async (req, res) => {
	const invoiceData = await Invoice.findAll({
		include:{model: Invoice_items}
	})
	const invoice = invoiceData.map((inv)=>inv.get({plain:true}))
	res.json(invoice)
})

router.get('/:id', async (req, res) => {
	const invoiceData = await Invoice.findByPk(req.params.id,{
		include:{model: Invoice_items}
	})
	const invoice = invoiceData.get({plain:true})
	res.json(invoice)
})


// add new order
router.post('/', async (req, res) => {
	try{
		const userData = await Customer.findByPk(req.session.customer_id,{
			attributes:{exclude:['password']}
		})

		// check admin and set object based on admin status
		if (userData.checkAdmin()){
			const object = {
				customer_id:req.session.customer_id,
				customer_name: userData.name,
				customer_email: userData.email,
				address: userData.address,
				phone1: userData.phone1,
				phone2: userData.phone2,
				due_date: req.body.due_date,
				note: req.body.note,
				approve: false
			}
		}
		else{
			const object = {
				customer_id:req.session.customer_id,
				customer_name: userData.name,
				customer_email: userData.email,
				address: userData.address,
				phone1: userData.phone1,
				phone2: userData.phone2,
				due_date: req.body.due_date,
				note: req.body.note,
				approve: req.body.approve
			}
		}
		
		const newInvoice = await Invoice.create(object,{returning:true});
		const invoice_items = req.body.invoice_items

		
		for(const item of invoice_items){
			let itemData = await Item.findByPk(item.id)
			let itemPrice = await Price.findOne({where:{
				customer_id : req.session.customer_id,
				item_id: item.id
			}})
			const itemObject={
				invoice_id: newInvoice.id,
				item_id: item.id,
				quantity: item.quantity,
				note: item.note,
				unit_price: itemPrice.unit_price,
				tax_rate: itemData.tax_rate,
				discount: itemPrice.discount
			}
			const newInvoiceItems = await Invoice_items.create(itemObject,{returning:true});

			if(!newInvoiceItems){
				res.status(500).send('An error occurred while creating the invoice')
				return
			}
		}
		
		res.status(200).json(newInvoice)
	}
	catch (err){
		res.status(400).json(err)
	}
})


// update order
router.put('/:invoice_id', async (req, res) => {
	try{

	}
	catch (err){
		res.status(400).json(err)
	}
})

// delete order

router.delete('/:invoice_id', async (req, res) => {
	try{
		const invoiceData = await Invoice.destroy({
			where: {invoice_id: req.params.invoice_id}
		})

		if(!invoiceData){
			res.status(400).json(err)
		}

		res.status(200).json(invoiceData)
	}
	catch(err){
		res.status(400).json(err)
	}
})



module.exports = router