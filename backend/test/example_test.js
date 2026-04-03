const chai = require('chai');
chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server');
const connectDB = require('../config/db');
const sinon = require('sinon');
const mongoose = require('mongoose');
const { expect } = chai;
const Assignment = require('../models/Assignment');
const { getAssignmentsByUser, createAssignment, updateAssignment } = require('../controllers/assignmentController');

chai.use(chaiHttp);
let server;
let port;

describe('Assignment Controller', () => {

    // it should fetch assignments for a specific user.
    it('should create a new assignment.', async () => {
        const req = {
            body: {
                title: 'Test Assignment',
                description: 'This is a test assignment.',
                course: 'Test Course',
                date: new Date(),
                priority: 'High',
            },
            user: { id: mongoose.Types.ObjectId() },
        };

        // create a mock assignment.
        const createdAssignment = {
            _id: mongoose.Types.ObjectId(),
            ...req.body,
            userId: req.user.id,
        };

        const createStub = sinon.stub(Assignment, 'create').resolves(createdAssignment);
        
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        await createAssignment(req, res);

        expect(createStub.calledOnceWith({
            title: req.body.title,
            description: req.body.description,
            course: req.body.course,
            date: req.body.date,
            priority: req.body.priority,
            userId: req.user.id,
        })).to.be.true;

        createStub.restore();
    });

});

describe('Update Assignment Test', () => {
    it('should update an existing assignment.', async () => {
        const assignmentId = mongoose.Types.ObjectId();
        const existingAssignment = {
            _id: assignmentId,
            title: "Old Title",
            description: "Old Description",
            course: "Old Course",
            date: new Date(),
            priority: "Low",
            userId: mongoose.Types.ObjectId(),
            save: sinon.stub().resolvesThis(),
        };
    

    const findOneStub = sinon.stub(Assignment, 'findOne').resolves(existingAssignment);

    const req = {
        params: { id: assignmentId },
        user: { id: existingAssignment.userId },
        body: {
            title: "New Title",
            description: "New Description",
        },
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
    };

    await updateAssignment(req, res);

    // expect(findByIdStub.calledOnceWith({
    //     _id: assignmentId,
    //     userId: req.params.userId,
    // })).to.be.true;

    expect(existingAssignment.title).to.equal("New Title");
    expect(existingAssignment.description).to.equal("New Description");
    //expect(res.status.called).to.be.false;
    findOneStub.restore();
    });

});

describe('Get Assignments By User Test', () => {
    it('should fetch assignments for a specific user.', async () => {
        const userId = new mongoose.Types.ObjectId();
        const assignments = [
            {
                _id: new mongoose.Types.ObjectId(),
                title: 'Assignment 1',
                userId: userId,
            },
            {   _id: new mongoose.Types.ObjectId(),
                title: 'Assignment 2',
                userId: userId
            }
        ];

        const findStub = sinon.stub(Assignment, 'find').resolves(assignments);


        const req = {user: {id: userId}};
        const res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };
        
        await getAssignmentsByUser(req,res);

        expect(findStub.calledOnceWith({userId})).to.be.true;
        expect(res.json.calledWith(assignments)).to.be.true;
        //expect(res.status.called).to.be.false;

        findStub.restore();
        //const req = {
    });


    it('should return an error',async () =>{

        const findStub = sinon.stub(Assignment,'find').throws(new Error('DB Error'));

        const req = {user: {id: new mongoose.Types.ObjectId}};
        const res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };

        await getAssignmentsByUser(req, res)

        expect(res.status.calledWith(500)).to.be.true
        expect(res.json.calledWithMatch({message:'DB Error'})).to.be.true;

        findStub.restore()

    });
});

decribe('Delete Assignment Test',() => {
    it('should delete an existing assignment', async () => {
        const assignmentId = mongoose.Types.ObjectId();
        const existingAssignment = {
            _id: assignmentId,
            title: "Test Assignment",
            userId: mongoose.Types.ObjectId(),
            remove: sinon.stub().resolvesThis(),
        };
        const findOneStub = sinon.stub(Assignment, 'findOne').resolves(existingAssignment);

        const req = {
            params: { id: assignmentId },
            user: { id: existingAssignment.userId },
        };

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        await deleteAssignment(req, res);

        expect(findOneStub.calledOnceWith({
            _id: assignmentId,
            userId: req.user.id,
        })).to.be.true;
        expect(existingAssignment.remove.calledOnce).to.be.true;
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith({ message: 'Assignment deleted successfully' })).to.be.true;

        findOneStub.restore();

    });
});



